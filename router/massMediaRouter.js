const Router = require('express')
const router = new Router()
const {MassMedia} = require('../models')

const ApiError = require('../errors/ApiError')

class MassMediaController {
    async getAll(req, res, next) {
        try {
            console.log(123)
            let massMediaArray = await MassMedia.findAll()
            let photoArray = massMediaArray.filter(item => item.type === 'photo').map(item => {
                return {
                    title: item.title,
                    src: item.src
                }
            })
            let videoArray = massMediaArray.filter(item => item.type === 'video').map(item => {
                return {
                    src: item.src
                }
            })
            return res.status(200).json({
                photo: photoArray,
                video: videoArray
            })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next) {
        try {
            let arr = req.body
            await MassMedia.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(arr).map(item => {
                    return MassMedia.create({
                        type: item.type,
                        title: item.title === undefined ? '' : item.title,
                        src: item.src,
                    })
                })
            );

            let massMediaArray = await MassMedia.findAll()
            let photoArray = massMediaArray.filter(item => item.type === 'photo').map(item => {
                return {
                    title: item.title,
                    src: item.src
                }
            })
            let videoArray = massMediaArray.filter(item => item.type === 'video').map(item => {
                return {
                    src: item.src
                }
            })
            return res.status(200).json({
                photo: photoArray,
                video: videoArray
            })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const massMediaController = new MassMediaController()
router.get('/', massMediaController.getAll)
router.post('/', massMediaController.add)
module.exports = router
