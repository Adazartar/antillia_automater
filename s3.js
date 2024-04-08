import dotenv from 'dotenv'
import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from 'util'
import fs from 'fs'

import data from './fileNames.json' assert { type:"json" }

dotenv.config()

const randomBytes = promisify(crypto.randomBytes)

const region = "ap-southeast-2"
const bucketName = "antillia-forms"
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

export async function generateUploadURL() {
    const imageName = await createNewFileName()

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return { "imageName":imageName, "url":uploadURL }
}

export async function createNewFileName() {
    let newName = true;
    let rawBytes, imageName;

    while(newName) {
        rawBytes = await randomBytes(16)
        imageName = rawBytes.toString('hex')

        if(!data.names.includes(imageName)) {
            newName = false;
        }
    }
    
    data.names.push(imageName)
    fs.writeFile('fileNames.json', JSON.stringify(data), (err) => {
        if(err) {
            console.log("Error writing names")
            return
        }
    })

    return imageName;
}