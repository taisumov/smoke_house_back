const Router = require('express')
const router = new Router()
const {Header, Visibility} = require('../models')

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
            const {title, description, image, visible} = req.body
            if(title !== undefined)
                await Header.update({data: title}, {where: {name: 'title'}})
            if(description !== undefined)
                await Header.update({data: description}, {where: {name: 'description'}})
            if(image !== undefined)
                await Header.update({data: image}, {where: {name: 'image'}})
            if(visible !== undefined)
                await Visibility.update({visible}, {where: {name: 'header'}})
            let newHeaderInfo = await modelGetAll(Header)
            return res.status(200).json(newHeaderInfo)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getHeader(req, res, next) {
        try {
            const isAllowed = res.locals.isauth
            const isVisible = await Visibility.findOne({where: {name: 'header'}})

            let newHeaderInfo = await modelGetAll(Header)

            if (isAllowed || (newHeaderInfo && isVisible)) {
                return res.status(200).json({...newHeaderInfo, visible: isVisible.visible})
            } else {
                return res.status(200).json(undefined)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const headerController = new HeaderController()

router.post('/', authToken, headerController.update)
router.get('/', headerController.getHeader)

module.exports = router
