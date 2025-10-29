import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";

let pineconeClientInstance: Pinecone | null = null;

export async function getPineconeClient() {
  if (pineconeClientInstance) return pineconeClientInstance;

  try {
    const client = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });

    // Optionally verify the index exists
    const indexList = await client.listIndexes();
    const indexName = env.PINECONE_INDEX_NAME;

    if (!indexList.indexes?.find(i => i.name === indexName)) {
      console.warn(`❌ Index "${indexName}" not found in Pinecone project.`);
      console.warn("➡️ Please create it manually in the Pinecone Console.");
    } else {
      console.log(`✅ Connected to Pinecone index: ${indexName}`);
    }

    pineconeClientInstance = client;
    return client;
  } catch (error) {
    console.error("❌ Failed to initialize Pinecone Client:", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}
