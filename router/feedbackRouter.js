const Router = require('express')
const router = new Router()
const {Feedback} = require('../models')

const ApiError = require('../errors/ApiError')
const {authToken} = require("../middleware/auth");

class FeedbackController {
    async getAll(req, res, next) {
        try {
            let feedbackInfo = await Feedback.findAll()
            let photoArray = feedbackInfo.filter(item => item.type === 'photo').map(item => item.content)
            let videoArray = feedbackInfo.filter(item => item.type === 'video').map(item => item.content)
            let textArray = feedbackInfo.filter(item => item.type === 'text').map(item => item.content)
            return res.status(200).json({
                photo: photoArray,
                video: videoArray,
                text: textArray,
            })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async add(req, res, next) {
        try {
            let feedbackArray = req.body
            await Feedback.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(feedbackArray).map(item => {
                    return Feedback.create({
                        type: item.type,
                        content: item.content
                    })
                })
            );
            let feedbackInfo = await Feedback.findAll()
            let photoArray = feedbackInfo.filter(item => item.type === 'photo').map(item => item.content)
            let videoArray = feedbackInfo.filter(item => item.type === 'video').map(item => item.content)
            let textArray = feedbackInfo.filter(item => item.type === 'text').map(item => item.content)
            return res.status(200).json({
                photo: photoArray,
                video: videoArray,
                text: textArray,
            })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const feedbackController = new FeedbackController()
router.post('/', authToken, feedbackController.add)
router.get('/', feedbackController.getAll)
module.exports = router
