#!/usr/bin/env node
"use strict";

// Auto-deploy webhook for Olborg only. Verifies GitHub's HMAC-SHA256 signature over the
// raw request body before ever running anything. Reads WEBHOOK_SECRET from .env.local
// (never committed) rather than hardcoding it here.

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const REPO_DIR = process.env.WEBHOOK_REPO_DIR || "/var/www/olborg";
const PORT = process.env.WEBHOOK_PORT || 9010;
const PM2_APP_NAME = process.env.WEBHOOK_PM2_APP || "olborg";

// Reads only WEBHOOK_SECRET out of .env.local — deliberately not a blanket import. This
// process stays alive for days between deploys, so pulling every key into its own
// process.env would permanently cache whatever .env.local said at startup; that stale
// snapshot then leaks into every future build via buildEnv below, silently ignoring any
// later .env.local edit (this is exactly what broke NEXT_PUBLIC_SITE_URL after the
// domain/SSL migration — the webhook had been running since before that change).
function loadWebhookSecret() {
  const envPath = path.join(REPO_DIR, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    if (key !== "WEBHOOK_SECRET") continue;
    if (!("WEBHOOK_SECRET" in process.env)) process.env.WEBHOOK_SECRET = trimmed.slice(idx + 1).trim();
  }
}
loadWebhookSecret();

const SECRET = process.env.WEBHOOK_SECRET;
if (!SECRET) {
  console.error("WEBHOOK_SECRET is not set (checked .env.local) — refusing to start.");
  process.exit(1);
}

function verifySignature(rawBody, signatureHeader) {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(rawBody).digest("hex");
  const provided = signatureHeader.slice("sha256=".length);
  const expectedBuf = Buffer.from(expected, "hex");
  const providedBuf = Buffer.from(provided, "hex");
  if (expectedBuf.length !== providedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

let deployInProgress = false;

function runDeploy() {
  if (deployInProgress) {
    console.log(`[${new Date().toISOString()}] Deploy already in progress, skipping`);
    return;
  }
  deployInProgress = true;

  const steps = [
    ["git", ["pull", "origin", "main"]],
    ["npm", ["ci"]],
    ["npm", ["run", "build"]],
    ["pm2", ["restart", PM2_APP_NAME]],
  ];
  // npm ci/build need devDependencies (autoprefixer, tailwindcss, ...) available, so this
  // must NOT inherit NODE_ENV=production from this webhook process's own PM2 env, or npm
  // silently skips devDependencies and the build fails on a missing postcss plugin.
  const buildEnv = { ...process.env };
  delete buildEnv.NODE_ENV;
  let i = 0;
  function next() {
    if (i >= steps.length) {
      console.log(`[${new Date().toISOString()}] Deploy finished`);
      deployInProgress = false;
      return;
    }
    const [cmd, args] = steps[i++];
    console.log(`[${new Date().toISOString()}] $ ${cmd} ${args.join(" ")}`);
    execFile(cmd, args, { cwd: REPO_DIR, env: buildEnv, maxBuffer: 1024 * 1024 * 20 }, (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      if (err) {
        console.error(`[${new Date().toISOString()}] Deploy step failed: ${cmd} ${args.join(" ")}`, err);
        deployInProgress = false;
        return;
      }
      next();
    });
  }
  console.log(`[${new Date().toISOString()}] Deploy triggered`);
  next();
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/deploy-hook") {
    res.writeHead(404);
    res.end();
    return;
  }

  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const rawBody = Buffer.concat(chunks);
    const signature = req.headers["x-hub-signature-256"];

    if (!verifySignature(rawBody, signature)) {
      console.warn(`[${new Date().toISOString()}] Rejected webhook: invalid signature`);
      res.writeHead(401);
      res.end("invalid signature");
      return;
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      res.writeHead(400);
      res.end("invalid payload");
      return;
    }

    // Only an actual push to main deploys. GitHub's own event type (not payload shape)
    // decides this — a ping event has no `ref` field and would otherwise fall through.
    const eventType = req.headers["x-github-event"];
    if (eventType !== "push") {
      res.writeHead(200);
      res.end(`ignored event ${eventType || "unknown"}`);
      return;
    }
    if (payload.ref !== "refs/heads/main") {
      res.writeHead(200);
      res.end(`ignored ref ${payload.ref}`);
      return;
    }

    res.writeHead(200);
    res.end("deploy triggered");
    runDeploy();
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Olborg deploy webhook listening on 127.0.0.1:${PORT}`);
});
