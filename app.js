import express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'

import { submit_to_database, getNewWorkOrderNumber, createWorker, getWorkers, getForm, getSubmittedForms, getCompletedForms, getJobs, getWorkersAndJobs, deleteWorker, staffStillCurrent, getUnassignedForms } from './database.js'
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

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.post('/uploadToNode', upload.single('image'), (req, res) => {
    //console.log(req.file.filename)
    res.json({ 'filename': req.file.filename })
})

app.get('/admin', (req, res) => {
    res.render("admin.ejs")
})

app.get('/admin/getWorkers', async (req, res) => {
    res.json({ 'names': await getWorkers() })
})

app.get('/admin/create_work_order', (req, res) => {
    res.render("create_work_order.ejs")
})

app.post('/admin/create_work_order/new-entry', async (req, res) => {
    const result = await staffStillCurrent(req.body.staffID)
    if(result) {
        await submit_to_database('forms', {"form_type": req.body.form_type,
                                        "staffID": parseInt(req.body.staffID),
                                        "submitted": req.body.submitted,
                                        "completed": req.body.completed,
                                        "workOrderNumber": req.body.workOrderNumber,
                                        "attendance_num": req.body.attendance_num,
                                        "address": req.body.address})
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }    
})

app.post('/admin/get_form', async (req, res) => {
    const form = await getForm(req.body.workOrderNumber)
    res.json(form)
})

app.get('/admin/workOrderNumber', async (req, res) => {
    res.json({ 'workOrderNumber': await getNewWorkOrderNumber()})
})

app.get('/admin/unassigned_jobs', async (req, res) => {
    res.render("unassigned_jobs.ejs")
})

app.get('/admin/unassigned_jobs/get_forms', async (req, res) => {
    const forms = await getUnassignedForms()
    res.json(forms)
})

app.get('/admin/submitted_jobs', (req, res) => {
    res.render("submitted_jobs.ejs")
})

app.get('/admin/submitted_jobs/get_forms', async (req, res) => {
    const forms = await getSubmittedForms()
    res.json(forms)
})

app.get('/admin/create_purchase_order', (req, res) => {
    res.render("create_purchase_order.ejs")
})

app.get('/admin/completed_jobs', (req, res) => {
    res.render("completed_jobs.ejs")
})

app.get('/admin/completed_jobs/get_forms', async (req, res) => {
    const forms = await getCompletedForms()
    res.json(forms)
})

app.get('/admin/staff', (req, res) => {
    res.render("admin_staff.ejs")
})

app.get('/admin/staff/jobs', async (req, res) => {
    const info = await getWorkersAndJobs()
    res.json(info)
})

app.post('/admin/staff/delete', async (req, res) => {

    await deleteWorker(req.body.id)
    res.sendStatus(200)
})

app.post('/admin/create_worker_id', async (req, res) => {
    await createWorker(req.body.name)
    res.sendStatus(200)
})

app.get('/staff', (req, res) => {
    res.render("staff.ejs")
})

app.get('/staff/jobs', (req, res) => {
    res.render("jobs.ejs")
})

app.post('/staff/jobs/get_jobs', async (req, res) => {
    const jobs = await getJobs(req.body.user)
    res.json(jobs)
})

app.get('/form1', (req, res) => {
    res.render("form1.ejs")
})

app.post('/form1/submit', async (req, res) => {
    //Add json to database
    await submit_to_database('forms', req.body)

    //upload photos to S3
    for(const photoName of req.body.outside) {
        await uploadPhoto(photoName)
    }
    for(const room of req.body.rooms) {
        for(const photoName of room.photos) {
            await uploadPhoto(photoName)
        }
    }
    res.sendStatus(200)
})

app.get('/form2', (req, res) => {
    res.render("form2.ejs")
})

app.post('/form2/submit', async (req, res) => {
    //Add json to database
    await submit_to_database('forms', req.body)

    //upload photos to S3
    for(const photoName of req.body.outside) {
        await uploadPhoto(photoName)
    }
    for(const room of req.body.rooms) {
        for(const photoName of room.photos) {
            await uploadPhoto(photoName)
        }
    }
    for(const room of req.body.existing_rooms) {
        for(const photoName of room.photos) {
            await uploadPhoto(photoName)
        }
    }
    //Return status to allow a redirect to occur on the fetch call
    res.sendStatus(200)
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