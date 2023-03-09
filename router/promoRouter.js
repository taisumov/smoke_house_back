const Router = require('express')
const router = new Router()
const {Promo, Visibility} = require('../models')

const ApiError = require('../errors/ApiError')

class PromoController {
    async getAll(req, res, next) {
        try {
            const isAllowed = res.locals.isauth
            const isVisible = await Visibility.findOne({where: {name: 'promo'}})

            let promoArray = await Promo.findAll()
            promoArray = promoArray.map(item => item.text)
            if (isAllowed || isVisible.visible) {
                return res.status(200).json({promo: promoArray, visible: isVisible.visible})
            } else {
                return res.status(200).json(undefined)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next){
        try {
            const {text, visible} = req.body
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
            await Visibility.update({visible}, {where: {name: 'promo'}})
            return res.status(200).json({promo: promoArray, visible})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const promoController = new PromoController()
router.get('/', promoController.getAll)
router.post('/add', promoController.add)
module.exports = router
