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

function loadEnvLocal() {
  const envPath = path.join(REPO_DIR, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

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

function runDeploy() {
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
      return;
    }
    const [cmd, args] = steps[i++];
    console.log(`[${new Date().toISOString()}] $ ${cmd} ${args.join(" ")}`);
    execFile(cmd, args, { cwd: REPO_DIR, env: buildEnv, maxBuffer: 1024 * 1024 * 20 }, (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      if (err) {
        console.error(`[${new Date().toISOString()}] Deploy step failed: ${cmd} ${args.join(" ")}`, err);
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

    if (payload.ref && payload.ref !== "refs/heads/main") {
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
