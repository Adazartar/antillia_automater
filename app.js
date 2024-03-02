import express from 'express'

const app = express()
app.use(express.urlencoded({ extended : true }))
app.set('view engine', 'ejs')

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.get('/', (req, res) => {
    res.render("index.ejs")
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