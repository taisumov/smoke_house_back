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
        {expiresIn: '730h'}
    )
}

const authToken = (req, res, next) => {

    if(req.method === "OPTIONS")
        next()

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token)
            return res.status(401).json("Пользователь не авторизован")
        req.user = jwt.verify(token, process.env.TOKEN_SECRET)
        next()
    } catch (e) {
        res.status(401).json("Пользователь не авторизован, повторите снова")
    }
}

const isAuthUser = (req, res, next) => {
    try {
        const token = `${req.headers.authorization}`.split(' ')[1]
        res.locals.isauth = !!token
        next()
    } catch (e) {
        res.locals.isauth = false
        next()
    }
}

module.exports = {
    genAccessToken,
    authToken,
    isAuthUser
}
