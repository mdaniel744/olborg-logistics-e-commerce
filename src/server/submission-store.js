import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const storageDirectory = path.join(process.cwd(), ".data");

export async function saveSubmission(kind, record) {
  await mkdir(storageDirectory, { recursive: true });
  const file = path.join(storageDirectory, `${kind}.ndjson`);
  await appendFile(file, `${JSON.stringify(record)}\n`, "utf8");
  return record;
}
