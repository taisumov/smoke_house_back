const Router = require('express')
const router = new Router()
const {Promo} = require('../models')

const ApiError = require('../errors/ApiError')

class PromoController {
    async getAll(req, res, next) {
        try {
            let promoArray = await Promo.findAll()
            promoArray = promoArray.map(item => item.text)
            return res.status(200).json(promoArray)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next){
        try {
            const {text} = req.body
            await Promo.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(text).map(item => {
                    return Promo.create({text: item}).then(res => console.log(res.dataValues.text))
                })
            );
            let promoArray = await Promo.findAll()
            promoArray = promoArray.map(item => item.text)
            return res.status(200).json(promoArray)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const promoController = new PromoController()
router.get('/', promoController.getAll)
router.post('/add', promoController.add)
module.exports = router
