import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").slice(0, 6);
    if (files.length === 0) {
      return Response.json({ error: "missing_files" }, { status: 400 });
    }

    const outputDirectory = path.join(process.cwd(), "public", "uploads");
    await mkdir(outputDirectory, { recursive: true });
    const urls = [];

    for (const file of files) {
      const extension = extensions[file.type];
      if (!extension || file.size > 5 * 1024 * 1024) {
        return Response.json({ error: "invalid_file" }, { status: 400 });
      }
      const filename = `${randomUUID()}.${extension}`;
      await writeFile(path.join(outputDirectory, filename), Buffer.from(await file.arrayBuffer()));
      urls.push(`/uploads/${filename}`);
    }

    return Response.json({ urls });
  } catch (error) {
    console.error("Upload failed", error);
    return Response.json({ error: "upload_failed" }, { status: 500 });
  }
}
