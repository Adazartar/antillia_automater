import dotenv from 'dotenv'

import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config()

const uri = "mongodb+srv://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@aenforms.a9lg4ty.mongodb.net/?retryWrites=true&w=majority&appName=AENForms"

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

export async function submit_to_database(form_name, file) {
    const dbName = "AENForms";
    const collectionName = form_name;

    try {
      await client.connect();
      
      const database = client.db(dbName);
      const collection = database.collection(collectionName);
      const result = collection.insertOne(file);
      /*
      await client.db("admin").command({ping: 1})
      console.log("Pinged")
      */
    
    } catch {
      console.log("Error uploading to Database")
      return
    }
    console.log("Inserted into Database")
}
