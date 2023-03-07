const Router = require('express')
const router = new Router()
const {Video, Visibility} = require('../../models')

const ApiError = require('../../errors/ApiError')
const {authToken} = require("../../middleware/auth");

class VideoController {
    async upload(req, res, next) {
        try {
            const {src, name} = req.body
            if(src !== undefined && name !== undefined) {
                const videoItem = await Video.create({
                    src, name
                })
                return res.status(200).json(videoItem)
            }

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getMain(req, res, next) {
        try {
            const isAllowed = res.locals.isauth
            const isVisible = await Visibility.findOne({where: {name: 'main_video'}})

            const videoItem = await Video.findOne({where: {name: 'main'}})

            if (isAllowed || (videoItem && isVisible)) {
                return res.status(200).json(videoItem?.src)
            } else {
                return res.status(200).json(undefined)
            }
        }
        catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async addMain(req, res, next) {
        try {
            console.log(req.body)
            const {src} = req.body
            if (src === undefined)
                return next(ApiError.forbidden('Введите значение источника видео'))

            const videoItem = await Video.findOne({where: {name: 'main'}})
                .then((video) => {
                    if (video)
                        return video.update({src})
                    else
                        return Video.create({name: 'main', src})
                })
            console.log(videoItem)
            return res.status(200).json({src: videoItem.src})
        }
        catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const videoController = new VideoController()

router.post('/upload', authToken, videoController.upload)
router.post('/main', authToken, videoController.addMain)
router.get('/main', videoController.getMain)

module.exports = router
