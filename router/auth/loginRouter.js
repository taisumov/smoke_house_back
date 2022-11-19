const Router = require('express')
const router = new Router()

const ApiError = require('../../errors/ApiError')
const {genAccessToken} = require("../../middleware/auth");
const {User} = require("../../models");

class loginController {
    async login(req, res, next) {
        console.log(123)
        const {username, password} = req.body
        let user = await User.findOne({where:{username}})
        if (!user || (user.password !== password)) return next(ApiError.forbidden('Неверный логин/пароль'))
        let token = genAccessToken(username, password)
        return res.status(200).json(token)
    }


}

let controller = new loginController()

router.post('/', controller.login)

module.exports = router
