const Router = require('express')
const router = new Router()
const {Header} = require('../models')

const ApiError = require('../errors/ApiError')
const {authToken} = require("../middleware/auth");

const modelGetAll = async (model) => {
    let headerInfo = await model.findAll()
    let obj = {}
    headerInfo.map(item => {obj[item?.name] = item?.data})
    return obj
}

class HeaderController {
    async update(req, res, next){
        try {
            const {title, description, image} = req.body
            if(title !== undefined)
                await Header.update({data: title}, {where: {name: 'title'}})
            if(description !== undefined)
                await Header.update({data: description}, {where: {name: 'description'}})
            if(image !== undefined)
                await Header.update({data: image}, {where: {name: 'image'}})
            let newHeaderInfo = await modelGetAll(Header)
            return res.status(200).json(newHeaderInfo)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getHeader(req, res, next) {
        try {
            let newHeaderInfo = await modelGetAll(Header)
            return res.status(200).json(newHeaderInfo)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const headerController = new HeaderController()

router.post('/', authToken, headerController.update)
router.get('/', headerController.getHeader)

module.exports = router
