import dotenv from 'dotenv'

import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

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

export async function submit_to_database(file) {
  try {
    await client.connect();
    
    const database = client.db(dbName);
    const collection = database.collection('forms');
    const result = collection.insertOne(file);
  
  } catch {
    console.log("Error uploading to Database")
  }
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
    const result = await collection.find({ is_current: true }, {"name.$":1}).toArray()
  
    if(result.length > 0) {
      return result
    } else {
      return null
    }
  } catch {
    console.log("Error getting Work Order Number")
  }
}

export async function createWorker(name, username, admin, password) {
  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection("staff")
    const ID = await collection.find({}).sort({"staffID": -1}).limit(1).toArray()

    let nextID;
    if(ID.length == 0) {
      nextID = 1;
    } else {
      nextID = ID[0].staffID + 1
    }
    const result = collection.insertOne({ "staffID": nextID, "name": name, "username":username, "password":password, "admin":admin, "is_current": true })

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

export async function getJobs(staffID) {
  try {
    await client.connect()

    const database = client.db(dbName)

    const form = await database.collection("forms").find({"staffID":parseInt(staffID), "submitted":false}).sort({"attendance_num":-1}).project({"_id":1, "workOrderNumber":1, "attendance_num":1, "job_address":1, "form_type":1}).toArray()

    if(form.length > 0) {
      return form
    } else {
      return null
    }

  } catch {
    console.log(`Error getting jobs`)
  }
}

export async function getWorkersAndJobs() {
  var info = {}
  try {
    await client.connect()

    const database = client.db(dbName)
    const staff = await database.collection('staff').find({ is_current: true }).toArray()
    info["staff"] = staff

    if(staff.length == 0) {
      return null
    }

    for(var i = 0; i < staff.length; i++) {
      info[staff[i].staffID] = await database.collection('forms').find({staffID: staff[i].staffID, submitted: false}).toArray()
    } 

    return info
  } catch {
    console.log("Error getting forms")
  }
}

export async function deleteWorker(id) {
  const collectionName = "staff"
  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection(collectionName)
    const staff = await collection.updateOne({ staffID: parseInt(id) }, { $set : { is_current: false }})

  } catch {
    console.log("Error deleting staff member")
  }
} 

export async function staffStillCurrent(id) {
  const collectionName = "staff"

  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const result = await collection.find({ staffID: parseInt(id) }).toArray()

    if(result.length > 0) {
      return true
    } else {
      return false
    }
  } catch {
    console.log("Error checking staff member")
    return false
  }
}

export async function getUnassignedForms() {
  try {
    await client.connect()

    const database = client.db(dbName)

    const form = await database.collection("forms").find({"staffID":null}).project({"workOrderNumber":1, "attendance_num":1, "job_address":1, "form_type":1}).toArray()

    if(form.length > 0) {
      return form
    } else {
      return null
    }

  } catch {
    console.log(`Error getting jobs for ${user}`)
  }
}

export async function unassignJob(id) {
  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection("forms")

    await collection.updateOne({ _id:new ObjectId(String(id))}, { $set:{ "staffID":null } })

  } catch {
    console.log("Could not unassign job")
  }
}

export async function assignJob(id, staffID) {
  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection("forms")

    await collection.updateOne({ _id:new ObjectId(String(id)) }, { $set:{ 'staffID':parseInt(staffID) } })
    console.log("assigned")
  } catch {
    console.log("Cannot assign job to worker")
  }
}

export async function updateForm(file) {
  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection("forms")
    
    var id = file.id
    delete file.id

    await collection.updateOne({ _id:new ObjectId(String(id))}, { $set: file })

  
  } catch {
    console.log("Could not update form")
  }
}

export async function submittedForm(id) {
  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection("forms")

    await collection.updateOne({ _id:new ObjectId(String(id))}, { $set:{ "submitted":true } })

  } catch {
    console.log("Could not submit form")
  }
}

export async function getAllFormData(id) {
  try {
    await client.connect()

    const database = client.db(dbName)
    const collection = database.collection("forms")

    const result = await collection.findOne({ _id:new ObjectId(String(id))})

    return result
  } catch {
    console.log("Could not get form data")
  }
}

export async function getUser(username) {
  try {
    await client.connect()

    const database = client.db(dbName)
    const result = await database.collection("staff").findOne({ "username": username })

    return result
  } catch {
    console.log("Could not find user with that username")
  }
}

export async function getUserByID(staffID) {
  try {
    await client.connect()

    const database = client.db(dbName)
    const result = await database.collection("staff").findOne({ "staffID":staffID })

    return result
  } catch {
    console.log("Could not find user with that staffID")
  }
}