const Router = require('express')
const router = new Router()
const {FormOrder} = require('../models')

const ApiError = require('../errors/ApiError')

class FormOrderController {
    async add(req, res, next) {
        try {
            const arr = req.body
            await FormOrder.destroy({
                where: {},
                truncate: true
            })
            Array.from(arr).map(async (form) => {
                await FormOrder.create({name: form.name, is_email: form.is_email === undefined ? false : form.is_email})
            })
            let formOrderFields = await FormOrder.findAll()
            return res.status(200).json(formOrderFields)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res, next) {
        try {
            let formOrderFields = await FormOrder.findAll()
            let email_send = ''
            let arrNames = formOrderFields.map(item => {
                if (item?.is_email === false) {
                    return item.name
                } else {
                    email_send = item.name
                }
            })
            return res.status(200).json({
                names: arrNames.filter(el => el != null),
                email: email_send
            })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const formOrderController = new FormOrderController()
router.get('/get', formOrderController.getAll)
router.post('/upload', formOrderController.add)
module.exports = router
