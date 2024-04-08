import express from 'express'
import bodyParser from 'body-parser'

const app = express()

import dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcrypt'
import flash from 'express-flash'
import session from 'express-session'

import { submit_to_database, getNewWorkOrderNumber, createWorker, getWorkers, 
    getForm, getSubmittedForms, getCompletedForms, getJobs, getWorkersAndJobs, 
    deleteWorker, staffStillCurrent, getUnassignedForms, unassignJob, assignJob,
    updateForm, submittedForm, getAllFormData, getUser, getUserByID } from './database.js'
import { generateUploadURL } from './s3.js'

import passport from 'passport'
import { initialise } from './passport-config.js'
initialise(passport, async (username) => await getUser(username), async (id) => await getUserByID(id))

app.use(express.urlencoded({ extended:true }))
app.use(bodyParser.json())

app.use((err, req, res, next) => {
    console.log(err)
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.post("/login", checkNotAuthenticated, function (req, res, done) {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(302).json({ redirectUrl: "/login" })
        }
        req.logIn(user, function (err) {
            if (err) {
                return done(err);
            }
            /*
            if(user.user.admin) {
                return res.status(302).json({ redirectUrl: "/admin" });
            }*/
            return res.status(302).json({ redirectUrl: "/admin" });
            
        })
        })(req, res, done);
  })

app.get('/admin', checkAdmin, (req, res) => {
    res.render("admin.ejs")
})

app.get('/admin/getWorkers', checkAdmin, async (req, res) => {
    res.json({ 'names': await getWorkers() })
})

app.get('/admin/create_work_order', checkAdmin, (req, res) => {
    res.render("create_work_order.ejs")
})

app.post('/admin/create_work_order/new-entry', checkAdmin, async (req, res) => {
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

app.post('/admin/get_form', checkAdmin, async (req, res) => {
    const form = await getForm(req.body.workOrderNumber)
    res.json(form)
})

app.get('/admin/workOrderNumber', checkAdmin, async (req, res) => {
    res.json({ 'workOrderNumber': await getNewWorkOrderNumber()})
})

app.get('/admin/unassigned_jobs', checkAdmin, async (req, res) => {
    res.render("unassigned_jobs.ejs")
})

app.get('/admin/unassigned_jobs/get_forms', checkAdmin, async (req, res) => {
    const forms = await getUnassignedForms()
    res.json(forms)
})

app.post('/admin/unassigned_jobs/assign', checkAdmin, async (req, res) => {
    await assignJob(req.body.id, req.body.staffID)
    res.sendStatus(200)
})

app.get('/admin/submitted_jobs', checkAdmin, (req, res) => {
    res.render("submitted_jobs.ejs")
})

app.get('/admin/submitted_jobs/get_forms', checkAdmin, async (req, res) => {
    const forms = await getSubmittedForms()
    res.json(forms)
})

app.get('/admin/create_purchase_order', checkAdmin, (req, res) => {
    res.render("create_purchase_order.ejs")
})

app.get('/admin/completed_jobs', checkAdmin, (req, res) => {
    res.render("completed_jobs.ejs")
})

app.get('/admin/completed_jobs/get_forms', checkAdmin, async (req, res) => {
    const forms = await getCompletedForms()
    res.json(forms)
})

app.get('/admin/staff', checkAdmin, (req, res) => {
    res.render("admin_staff.ejs")
})

app.get('/admin/staff/jobs', async (req, res) => {
    const info = await getWorkersAndJobs()
    res.json(info)
})

app.post('/admin/staff/delete', checkAdmin, async (req, res) => {
    await deleteWorker(req.body.id)
    res.sendStatus(200)
})

app.post('/admin/staff/unassign', checkAdmin, async (req, res) => {
    await unassignJob(req.body.id)
    res.sendStatus(200)
})

app.post('/admin/create_worker_id', checkAdmin, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await createWorker(req.body.name, req.body.username, req.body.admin, hashedPassword)
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
})

app.get('/staff', checkAuthenticated, (req, res) => {
    res.render("staff.ejs")
})

app.get('/staff/jobs', checkAuthenticated, (req, res) => {
    res.render("jobs.ejs")
})

app.get('/staff/jobs/get_jobs', checkAuthenticated, async (req, res) => {
    const jobs = await getJobs(req.user.staffID)
    res.json(jobs)
})

app.get('/staff/get_photo_url', checkAuthenticated, async (req, res) => {
    const url = await generateUploadURL()
    res.json(url)
})

app.post('/staff/jobs/getForm', checkAuthenticated, async (req, res) => {
    const result = await getAllFormData(req.body.id)
    res.json(result)
})

app.post('/staff/jobs/submit', checkAuthenticated, async (req, res) => {
    await updateForm(req.body)
    res.sendStatus(200)
})

app.post('/staff/jobs/submitted', checkAuthenticated, async (req, res) => {
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

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkAdmin(req, res, next) {
    if(req.isAuthenticated()) {
        if(req.user.admin) {
            return next()
        } else {
            return res.redirect('/staff')
            
        }
    }

    res.redirect('/login')
} 

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/')
    }

    return next()
}

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})