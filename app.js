import express from 'express'
import bodyParser from 'body-parser'

import { submit_to_database, getNewWorkOrderNumber, createWorker, getWorkers, 
    getForm, getSubmittedForms, getCompletedForms, getJobs, getWorkersAndJobs, 
    deleteWorker, staffStillCurrent, getUnassignedForms, unassignJob, assignJob,
    updateForm, submittedForm, getAllFormData } from './database.js'
import { generateUploadURL } from './s3.js'

const app = express()
app.use(express.urlencoded({ extended : true }))
app.use(bodyParser.json());
app.set('view engine', 'ejs')

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.get('/', (req, res) => {
    res.render("index.ejs")
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
        await submit_to_database({"form_type": req.body.form_type,
                                  "staffID": parseInt(req.body.staffID),
                                  "submitted": req.body.submitted,
                                  "completed": req.body.completed,
                                  "workOrderNumber": req.body.workOrderNumber,
                                  "attendance_num": req.body.attendance_num,
                                  "job_address": req.body.job_address,
                                  "initial": true})
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

app.post('/admin/unassigned_jobs/assign', async (req, res) => {
    await assignJob(req.body.id, req.body.staffID)
    res.sendStatus(200)
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

app.post('/admin/staff/unassign', async (req, res) => {
    await unassignJob(req.body.id)
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

app.get('/staff/get_photo_url', async (req, res) => {
    const url = await generateUploadURL()
    res.json(url)
})

app.post('/staff/jobs/getForm', async (req, res) => {
    const result = await getAllFormData(req.body.id)

    res.json(result)
})

app.post('/staff/jobs/submit', async (req, res) => {
    await updateForm(req.body)

    res.sendStatus(200)
})

app.post('/staff/jobs/submitted', async (req, res) => {
    await submittedForm(req.body.id)
    res.sendStatus(200)
})

app.get('/form1', (req, res) => {
    res.render("form1.ejs")
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