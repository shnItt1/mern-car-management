import { MongoClient } from "mongodb";

const connectionString =
  "mongodb+srv://shnnnItt1:L7GC7zRKq3JDMDgS@shnnnitt1.kug9vzw.mongodb.net/car-management?retryWrites=true&w=majority&appName=ShnnnItt1";

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client.db("car-management");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  }
}
