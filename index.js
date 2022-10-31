require('dotenv').config()

const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const {initHeader, initAdvantages} = require("./models")
const router = require('./router/index')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const errorHandler = require('./middleware/errorHandling')

const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router)
app.use('/media', express.static('static'))

app.use(errorHandler)

const start = async () => {
    await sequelize.authenticate()
    await sequelize.sync()
    // await initHeader()
    // await initAdvantages()
    app.listen(process.env.PORT)
}

start().then(() => console.log(`Started at ${process.env.PORT} port`))
