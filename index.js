require('dotenv').config()

const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./router/index')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const errorHandler = require('./middleware/errorHandling')
const jwt = require("jsonwebtoken");
const {genAccessToken} = require("./middleware/auth");

const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router)
app.use('/media', express.static('media'))
app.post('/token', (req, res, next) => {
    if(req.method !== "OPTIONS") {
        try {
            let {token, username, password} = req.body
            if (!token)
                return res.status(401).json("Пользователь не авторизован, токен недействителен")
            req.user = jwt.verify(token, process.env.TOKEN_SECRET)
            token = genAccessToken(username, password)
            return res.status(200).json(token)
        } catch (e) {
            res.status(403).json("Ошибка")
        }
    }
})

app.use(errorHandler)

const start = async () => {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(process.env.PORT)
}

start().then(() => console.log(`Started at ${process.env.PORT} port`))
