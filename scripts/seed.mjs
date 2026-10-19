import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env / .env.local without extra dependencies
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
const DBNAME = process.env.DBNAME;

if (!uri) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

const toysPath = join(root, "src", "data", "toys.json");
const products = JSON.parse(readFileSync(toysPath, "utf-8"));

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const collection = client.db(DBNAME).collection("products");

    // Clear existing data so re-running stays idempotent
    const cleared = await collection.deleteMany({});
    console.log(`Removed ${cleared.deletedCount} existing products`);

    if (products.length) {
      const result = await collection.insertMany(products);
      console.log(`Inserted ${result.insertedCount} products`);
    }

    const count = await collection.countDocuments();
    console.log(`Total products in collection: ${count}`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();
