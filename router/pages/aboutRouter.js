const Router = require('express')
const router = new Router()
const {About, Footer} = require('../../models')

const ApiError = require('../../errors/ApiError')
const {authToken} = require("../../middleware/auth");

const createResponse = async (model) => {
    let aboutFields = await model.findAll()
    let text = ''
    let arrNames = aboutFields.map(item => {
        if (item?.is_src_text === false) {
            return item.src
        } else {
            text = item.src
        }
    })

    return {
        images: arrNames.filter(el => el != null),
        text: text
    }
}

class AboutController {
    async add(req, res, next) {
        try {
            console.log(req.body)
            const arr = req.body
            await About.destroy({
                where: {},
                truncate: true
            })
            await Promise.all(
                Array.from(arr).map(item => {
                    return About.create({src: item.src, is_src_text: !!item?.is_src_text})
                })
            );

            // let aboutFields = await About.findAll()
            //
            // let text = ''
            // let arrNames = aboutFields.map(item => {
            //     if (item?.is_src_text === false) {
            //         return item.src
            //     } else {
            //         text = item.src
            //     }
            // })
            //
            // return res.status(200).json({
            //     images: arrNames.filter(el => el != null),
            //     text: text
            // })

            const response = await createResponse(About)

            return res.status(200).json(response)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res, next) {
        try {
            let aboutFields = await About.findAll()
            let text = ''
            let arrNames = aboutFields.map(item => {
                if (item?.is_src_text === false) {
                    return item.src
                } else {
                    text = item.src
                }
            })
            return res.status(200).json({
                images: arrNames.filter(el => el != null),
                text: text
            })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

const aboutController = new AboutController()
router.post('/', authToken, aboutController.add)
router.get('/', aboutController.getAll)
module.exports = router
