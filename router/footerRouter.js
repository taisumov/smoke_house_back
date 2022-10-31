const Router = require('express')
const router = new Router()
const {Footer} = require('../models')

const ApiError = require('../errors/ApiError')

class FooterController {
    async getAll(req, res, next) {
        try {
            let footerArray = await Footer.findAll()

            if(footerArray) {
                let numbersArr = footerArray.filter(item => item.type === 'number').map(item => {
                    return {name: item.name, value: item.value}
                })

                let emailArr = footerArray.filter(item => item.type === 'email').map(item => {
                    return {name: item.name, value: item.value}
                })

                return res.status(200).json({
                    phones: numbersArr,
                    emails: emailArr
                })
            } else return res.status(200).json({})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next) {
        try {
            let arr = req.body
            await Footer.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(arr).map(item => {
                    return Footer.create({
                        name: item.name,
                        type: item.type,
                        value: item.value,
                    })
                })
            );
            let footerArray = await Footer.findAll()
            let numbersArr = footerArray.filter(item => item.type === 'number').map(item => {
                return {name: item.name, value: item.value}
            })

            let emailArr = footerArray.filter(item => item.type === 'email').map(item => {
                return {name: item.name, value: item.value}
            })

            return res.status(200).json({
                phones: numbersArr,
                emails: emailArr
            })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const footerController = new FooterController()
router.get('/', footerController.getAll)
router.post('/', footerController.add)
module.exports = router
