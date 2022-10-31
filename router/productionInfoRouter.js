const Router = require('express')
const router = new Router()
const {ProductionInfo} = require('../models')

const ApiError = require('../errors/ApiError')

class ProductionInfoController {
    async getAll(req, res, next) {
        try {
            let productionInfo = await ProductionInfo.findAll()
            return res.status(200).json(productionInfo)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next) {
        try {
            let productionInfo = req.body
            await ProductionInfo.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(productionInfo).map(item => {
                    return ProductionInfo.create({
                        title: item.title,
                        src: item.src
                    })
                })
            );
            let productionInfoArray = await ProductionInfo.findAll()
            return res.status(200).json(productionInfoArray)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const productionInfoController = new ProductionInfoController()
router.get('/', productionInfoController.getAll)
router.post('/', productionInfoController.add)
module.exports = router
