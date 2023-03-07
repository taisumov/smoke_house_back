const Router = require('express')
const router = new Router()
const {Advantage, Visibility} = require('../../models')

const ApiError = require('../../errors/ApiError')
const {authToken} = require("../../middleware/auth");

class AdvantageController {
    async getAll(req, res, next) {
        try {
            const isAllowed = res.locals.isauth
            const isVisible = await Visibility.findOne({where: {name: 'advantages'}})

            let advantageArray = await Advantage.findAll()
            if (isAllowed || isVisible) {
                return res.status(200).json(advantageArray)
            } else {
                return res.status(200).json(undefined)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next) {
        try {
            let {advantage} = req.body
            await Advantage.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(advantage).map(item => {
                    return Advantage.create({
                        main_photo: item.main_photo,
                        extra_photo: item.extra_photo,
                        title: item.title,
                        description: item.description
                    })
                })
            );
            let advantageArray = await Advantage.findAll()
            return res.status(200).json(advantageArray)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const advantageController = new AdvantageController()
router.post('/', authToken, advantageController.add)
router.get('/', advantageController.getAll)
module.exports = router
