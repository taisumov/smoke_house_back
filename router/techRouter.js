const Router = require('express')
const router = new Router()
const {Technology} = require('../models')

const ApiError = require('../errors/ApiError')

class TechController {
    async getAll(req, res, next) {
        try {
            console.log(123333333)
            let techInfo = await Technology.findAll()
            let video = techInfo.find(item => item.is_video)?.src
            let techs = techInfo.filter(item => !item.is_video).map(item => {
                return {
                    src: item.src,
                    title: item.title,
                    description: item.description
                }
            })
            return res.status(200).json({techs, video})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next) {
        try {
            let techsArray = req.body
            await Technology.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(techsArray).map(item => {
                    return Technology.create({
                        src: item.src || '',
                        title: item.title || '',
                        description: item.description || '',
                        is_video: !!item.is_video
                    })
                })
            );

            let techInfo = await Technology.findAll()
            let video = techInfo.find(item => item.is_video)?.src
            let techs = techInfo.filter(item => !item.is_video).map(item => {
                return {
                    src: item.src,
                    title: item.title,
                    description: item.description
                }
            })

            return res.status(200).json({techs, video})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const techController = new TechController()
router.get('/', techController.getAll)
router.post('/', techController.add)
module.exports = router


