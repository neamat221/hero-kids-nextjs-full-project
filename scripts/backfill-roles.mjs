import dns from "node:dns";
import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv(file) {
  try {
    const content = readFileSync(join(root, file), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // file may not exist
  }
}

loadEnv(".env.local");
loadEnv(".env");

const uri = process.env.MONGODB_URI;
const DBNAME = process.env.DBNAME ?? "herokidsdb";

if (!uri) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const client = await MongoClient.connect(uri);
const col = client.db(DBNAME).collection("user");

const r = await col.updateMany(
  { kind: "account", role: { $exists: false } },
  { $set: { role: "user" } },
);
console.log("Backfill result — matched:", r.matchedCount, "modified:", r.modifiedCount);

const accounts = await col
  .find({ kind: "account" })
  .project({ email: 1, role: 1 })
  .toArray();
accounts.forEach((a) => console.log(" -", a.email, "→", a.role));

await client.close();
