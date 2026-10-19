import { MongoClient } from "mongodb";
import dns from "node:dns";

const uri = process.env.MONGODB_URI;
const DBNAME = process.env.DBNAME;

const collection = {
  PRODUCTS: "products",
  USER: "user",
  ORDERS: "orders",
  MESSAGES: "messages",
};

const SRV_SCHEME = "mongodb+srv://";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

// Some machines block SRV queries on the local resolver, which makes the
// driver fail with "querySrv ECONNREFUSED". Resolve the SRV/TXT records
// ourselves and hand the driver an equivalent direct connection string.
async function buildDirectUriFromSrv(srvUri) {
  const withoutScheme = srvUri.slice(SRV_SCHEME.length);
  const atIndex = withoutScheme.indexOf("@");
  if (atIndex === -1) {
    throw new Error("Malformed mongodb+srv:// URI: missing credentials");
  }

  const credentials = withoutScheme.slice(0, atIndex + 1);
  const rest = withoutScheme.slice(atIndex + 1);
  const queryIndex = rest.indexOf("?");
  const authority = queryIndex === -1 ? rest : rest.slice(0, queryIndex);
  const hostname = authority.split("/")[0];
  const rawQuery = queryIndex === -1 ? "" : rest.slice(queryIndex + 1).split("/")[0];

  const records = await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
  if (!records.length) {
    throw new Error(`No SRV records found for ${hostname}`);
  }
  const hosts = records.map((rec) => `${rec.name}:${rec.port}`).join(",");

  const params = new URLSearchParams(rawQuery);
  // mongodb+srv always implies TLS and defaults authSource to "admin".
  params.set("tls", "true");
  if (!params.has("authSource")) {
    params.set("authSource", "admin");
  }

  try {
    const txt = await dns.promises.resolveTxt(hostname);
    const txtParams = txt.flat().join(" ").split(/\s+/).filter(Boolean);
    for (const pair of txtParams) {
      const eq = pair.indexOf("=");
      if (eq === -1) continue;
      const key = pair.slice(0, eq);
      if (!params.has(key)) {
        params.set(key, pair.slice(eq + 1));
      }
    }
  } catch {
    // TXT record is optional.
  }

  return `mongodb://${credentials}${hosts}/?${params.toString()}`;
}

async function resolveConnectionUri() {
  if (!uri.startsWith(SRV_SCHEME)) {
    return uri;
  }

  try {
    return await buildDirectUriFromSrv(uri);
  } catch {
    // Retry the lookup against public resolvers before giving up.
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    return await buildDirectUriFromSrv(uri);
  }
}

// Cache the client promise across hot reloads and requests (Next.js pattern).
// On failure, clear the cache so the next call can retry instead of
// awaiting a permanently rejected promise.
function getClientPromise() {
  if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = resolveConnectionUri()
      .then((resolvedUri) => new MongoClient(resolvedUri).connect())
      .catch((err) => {
        globalThis._mongoClientPromise = null;
        throw err;
      });
  }
  return globalThis._mongoClientPromise;
}

export async function connectToMongoDB() {
  try {
    const client = await getClientPromise();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
    throw err;
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  const client = await getClientPromise();
  await client.close();
  globalThis._mongoClientPromise = null;
}

export const dbconnect = async (cname) => {
  const client = await getClientPromise();
  return client.db(DBNAME).collection(cname);
};

export { collection };
