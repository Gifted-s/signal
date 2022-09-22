// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: { users?: mongoDB.Collection, senders?: mongoDB.Collection  } = {}


// Initialize Connection
export async function connectToDatabase() {
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING || "");
    await client.connect();
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
    const usersCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME || "");
    const sendersCollection: mongoDB.Collection = db.collection(process.env.SENDERS_COLLECTION_NAME || "");
    collections.users = usersCollection;
    collections.senders = sendersCollection
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
}