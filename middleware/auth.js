const jwt = require('jsonwebtoken');
const ApiError = require("../errors/ApiError");
require('dotenv').config()

const genAccessToken = (username, password) => {
    return jwt.sign(
        {
            'username': username,
            'password': password
        },
        process.env.TOKEN_SECRET,
        {expiresIn: '1800s'}
    )
}

const authToken = (req, res, next) => {

    if(req.method === "OPTIONS")
        next()

    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)
        if (!token)
            return res.status(401).json("Пользователь не авторизован")
        req.user = jwt.verify(token, process.env.TOKEN_SECRET)
        next()
    } catch (e) {
        res.status(401).json("Пользователь не авторизован")
    }
}

module.exports = {
    genAccessToken,
    authToken
}
