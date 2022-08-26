// Импорт
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const sequelize = require("./db");

// Задаем порт
const PORT = process.env.PORT || 5000

// Инициализируем все необходимые модули и само приложение
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start().then(() => console.log('IS WORKING...'))
