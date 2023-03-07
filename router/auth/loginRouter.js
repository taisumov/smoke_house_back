const Router = require('express')
const router = new Router()

const ApiError = require('../../errors/ApiError')
const {genAccessToken} = require("../../middleware/auth");
const {User, initHeader, initAdvantages, initTechs, initDelivery, initReasons, initProd, initAboutFirst, initUsers,
    initForms, initVisibility
} = require("../../models");

class loginController {
    async login(req, res, next) {
        const {username, password} = req.body
        let user = await User.findOne({where:{username}})
        if (!user || (user.password !== password)) return next(ApiError.forbidden('Неверный логин/пароль'))
        let token = genAccessToken(username, password)
        return res.status(200).json(token)
    }

    async addUser(req, res, next) {
        try {
            const {username, password} = req.body
            let newUser = await User.create({username, password})
            return res.status(200).json(newUser)
        } catch (e) {
            return next(ApiError.badRequest("Такой никнейм уже есть!"))
        }
    }

    async deleteUser(req, res, next) {
        try {
            const {username} = req.body
            await User.destroy({where: {username}})
            return res.status(200).json("Удалили пользователя")
        } catch (e) {
            return next(ApiError.badRequest("Ошибка при удалении!"))
        }
    }

    async initDatabase(req, res, next) {
        await initHeader()
        await initAdvantages()
        await initTechs()
        await initDelivery()
        await initReasons()
        await initProd()
        await initAboutFirst()
        await initUsers()
        await initForms()
        await initVisibility()
        return res.status(200).json("Init completed")
    }
}

let controller = new loginController()

router.post('/', controller.login)
router.get('/init_db', controller.initDatabase)
router.post('/add_user', controller.addUser)
router.post('/delete_user', controller.deleteUser)

module.exports = router
