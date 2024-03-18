import dotenv from 'dotenv'

import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config()

const uri = "mongodb+srv://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@aenforms.a9lg4ty.mongodb.net/?retryWrites=true&w=majority&appName=AENForms"

const dbName = "AENForms"

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

export async function submit_to_database(form_name, file) {
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

export async function getNewWorkOrderNumber() {
  const collectionName = "forms"

  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection(collectionName)
    const ID = await collection.find({}).sort({"workOrderNumber": -1}).limit(1).toArray()
    
    if(ID.length == 0) {
      return null
    } else {
      return ID[0].workOrderNumber + 1;
    }
  } catch {
    console.log("Error getting Work Order Number")
  }
}

export async function getWorkers() {
  const collectionName = "staff"

  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection(collectionName)
    const result = await collection.find({}, {"name.$":1}).toArray()
  
    if(result.length > 0) {
      return result
    } else {
      return null
    }
  } catch {
    console.log("Error getting Work Order Number")
  }
}

export async function createWorker(name) {
  const collectionName = "staff"

  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection(collectionName)
    const ID = await collection.find({}).sort({"staffID": -1}).limit(1).toArray()

    let nextID;
    if(ID.length == 0) {
      nextID = 1;
    } else {
      nextID = ID[0].staffID + 1
    }
    const result = collection.insertOne({ "staffID": nextID, "name": name })

  } catch {
    console.log("Error creating new worker")
  }
}

export async function getForm(WON) {
  const collectionName = "forms"
  
  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection(collectionName)
    const form = await collection.find({ "workOrderNumber": parseInt(WON)}).sort( { 'attendance_num': -1 }).toArray()

    if(form.length > 0) {
      return form[0]
    } else {
      return null
    }
  } catch {
    console.log("Error getting form")
  }
}

export async function getSubmittedForms() {
  const collectionName = "forms"

  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection(collectionName)
    const forms = await collection.find({"submitted": true}).toArray()

    if(forms.length > 0) {
      return forms
    } else {
      return null
    }

  } catch {
    console.log("Error getting submitted forms")
  }
}

export async function getCompletedForms() {
  const collectionName = "forms"

  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection(collectionName)
    const forms = await collection.find({"completed": true}).toArray()

    if(forms.length > 0) {
      return forms
    } else {
      return null
    }

  } catch {
    console.log("Error getting completed forms")
  }
}