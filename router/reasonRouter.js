const Router = require('express')
const router = new Router()
const {Reason} = require('../models')

const ApiError = require('../errors/ApiError')

class ReasonController {
    async getAll(req, res, next) {
        try {
            console.log(123)
            let reasonArray = await Reason.findAll()
            return res.status(200).json(reasonArray)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next) {
        try {
            let reasons = req.body
            await Reason.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(reasons).map(item => {
                    return Reason.create({
                        title: item.title,
                        description: item.description,
                        color: item.color,
                        img: item.img
                    })
                })
            );
            let reasonArray = await Reason.findAll()
            return res.status(200).json(reasonArray)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const reasonController = new ReasonController()
router.get('/', reasonController.getAll)
router.post('/', reasonController.add)
module.exports = router
