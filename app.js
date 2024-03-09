import express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'

import { submit_to_database } from './database.js'
import { createNewFileName, uploadPhoto } from './s3.js'

const app = express()
app.use(express.urlencoded({ extended : true }))
app.use(bodyParser.json());
app.set('view engine', 'ejs')

const storage = multer.diskStorage({ 
    destination: "public/uploads",
    filename: async function(req, file, cb) {
        cb(null, await createNewFileName())
    }
});
const upload = multer({ storage: storage })

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.post('/uploadToNode', upload.single('image'), function(req, res) {
    //console.log(req.file.filename)
    res.json({ 'filename': req.file.filename })
})

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.get('/form1', (req, res) => {
    res.render("form1.ejs")
})

app.post('/form1/submit', async (req, res) => {
    //Add json to database
    await submit_to_database('form1', req.body)

    //upload photos to S3
    for(const photoName of req.body.outside) {
        await uploadPhoto(photoName)
    }
    for(const room of req.body.rooms) {
        for(const photoName of room.photos) {
            await uploadPhoto(photoName)
        }
    }
    res.sendStatus(201)
})

app.get('/form2', (req, res) => {
    res.render("form2.ejs")
})

app.get('/scope', (req, res) => {
    res.render("scope.ejs")
})

app.get('/inventory', (req, res) => {
    res.render("inventory.ejs")
})

app.get('/atp', (req, res) => {
    res.render("ATP.ejs")
})

app.get('/atd', (req, res) => {
    res.render("ATD.ejs")
})

app.use(express.static("public"))

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})