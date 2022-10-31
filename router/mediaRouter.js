const Router = require('express')
const router = new Router()
const fs = require('fs')

const ApiError = require('../errors/ApiError')
const uuid = require("uuid");
const path = require("path");

class MediaController {
    async uploadImage(req, res, next){
        try{
            console.log(req.files)
            let {file} = req.files
            let fileName = uuid.v4() + '.jpg'
            await file.mv(path.resolve(__dirname, '..', 'static', fileName))
            return res.status(200).json(fileName)
        } catch(e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteImage(req, res, next) {
        try {
            const {img} = req.body
            console.log(img)
            fs.unlinkSync(path.resolve(__dirname, '..', 'static', img))
            return res.status(200).json('Удаление прошло успешно!')
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const mediaController = new MediaController()
router.post('/upload', mediaController.uploadImage)
router.post('/delete', mediaController.deleteImage)
module.exports = router
