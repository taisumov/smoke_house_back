const Router = require('express')
const router = new Router()
const fs = require('fs')

const ApiError = require('../../errors/ApiError')
const uuid = require("uuid");
const path = require("path");
const {authToken} = require("../../middleware/auth");

class MediaController {
    async uploadImage(req, res, next){
        try{
            let {file} = req.files
            let fileName = uuid.v4() + `.${file.name.split('.').at(-1)}`
            await file.mv(path.resolve(__dirname, '..', '..', 'static', fileName))
            return res.status(200).json(fileName)
        } catch(e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteImage(req, res, next) {
        try {
            const {img} = req.body
            console.log(img)
            fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', img))
            return res.status(200).json('Удаление прошло успешно!')
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const mediaController = new MediaController()
router.post('/upload', authToken, mediaController.uploadImage)
router.post('/delete', mediaController.deleteImage)
module.exports = router
