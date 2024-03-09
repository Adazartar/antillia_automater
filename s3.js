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

export async function uploadPhoto(photoName) {
    fs.readFile(`./public/uploads/${photoName}`, (err, data) => {
        if(err) {
            console.log('Can\'t open photo')
        }

        const params = {
            Bucket: bucketName,
            Key: photoName,
            ContentType: 'image/jpeg',
            Body: data
        }

        s3.putObject(params, (err, data) => {
            if(err) {
                console.log('Can\'t upload photo to S3:', err)
                return;
            }
            console.log('Successfully uploaded photo to S3')
            console.log("https://antillia-forms.s3.ap-southeast-2.amazonaws.com/" + photoName)
        })
    })
}

// Every night check all the file names listed in S3 if they are not located in the database delete them
export function listPhotosInS3() {
    const params = {
        Bucket: bucketName
    };

    s3.listObjectsV2(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}
