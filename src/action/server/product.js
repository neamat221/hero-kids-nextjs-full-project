import { ObjectId } from "mongodb";
import { dbconnect, collection } from "@/lib/dbconnect";
import toys from "@/data/toys.json";

export async function getAllProducts() {
  try {
    const products = await dbconnect(collection.PRODUCTS);
    return await products.find({}).toArray();
  } catch (err) {
    console.error("getAllProducts failed:", err);
    return [];
  }
}

export async function getProductById(id) {
  // Non-ObjectId ids (e.g. array indexes from the home "Our product" links)
  // resolve directly from toys.json.
  if (!ObjectId.isValid(id)) {
    const index = Number(id);
    return Number.isInteger(index) && toys[index] ? toys[index] : null;
  }

  try {
    const products = await dbconnect(collection.PRODUCTS);
    return await products.findOne({ _id: new ObjectId(id) });
  } catch (err) {
    console.error("getProductById failed:", err);
    return null;
  }
}
