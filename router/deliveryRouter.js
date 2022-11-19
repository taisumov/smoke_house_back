const Router = require('express')
const {Delivery} = require("../models");
const {authToken} = require("../middleware/auth");
const router = new Router()

class DeliveryController {
    async getAll(req, res, next) {
        let result = await Delivery.findAll({where: {}})
        return res.status(200).json(result)
    }

    async add(req, res, next) {

        let items = req.body

        await Delivery.destroy({
            where: {},
            truncate: true
        })

        await Promise.all(
            Array.from(items).map(item => {
                return Delivery.create({
                    header: item.header,
                    type: item.type,
                    value: item.value
                })
            })
        )

        let result = await Delivery.findAll({where: {}})

        return res.status(200).json(result)
    }
}

const deliveryController = new DeliveryController()
router.post('/', authToken, deliveryController.add)
router.get('/', deliveryController.getAll)
module.exports = router
