const Router = require('express')
const router = new Router()
const slug = require('slug')
const {Item, Image, Parameters, Features, Extra} = require('../itemModels')

const ApiError = require('../errors/ApiError')

class itemController {

    async create(req, res, next) {
        try {
            const {category, name, images, video, parameters, material, features, extra_slugs} = req.body
            if(name !== undefined && name.length < 3) return next(ApiError.forbidden('Некорректное имя'))
            const slugName = slug(name)
            const isSlug = await Item.findOne({where: {slug: slugName}})
            if (!!isSlug) return next(ApiError.forbidden('Смените имя, чтобы товар можно было однозначно определить (имя повторяется)'))
            let parametersItems = []

            await Item.create()
                .then(
            parameters.map(one_param => parametersItems.push({
                name: one_param.name,
                options: [
                    one_param.first_opt,
                    one_param.second_opt,
                    one_param.third_opt,
                ].filter(item => item !== undefined)
            })))
            const item = await Item.create({
                name,
                slug: slugName,
                video,
                material,
                category
            })

            if (item) {
                await Promise.all(
                    Array.from(parametersItems).map(param => {
                        return Parameters.create({
                            name: param.name,
                            first_opt: param.options[0],
                            second_opt: param.options[1] || '',
                            third_opt: param.options[2] || '',
                            itemId: item.id
                        })
                    })
                )

                await Promise.all(
                    Array.from(images).map(image => {
                        Image.create({
                            src: image,
                            itemId: item.id
                        })
                    })
                )

                await Promise.all(
                    Array.from(features).map(feature => {
                        Features.create({
                            header: feature.header,
                            main_text: feature.main_text,
                            circle_text: feature.circle_text,
                            itemId: item.id
                        })
                    })
                )

                await Promise.all(
                    Array.from(extra_slugs).map(slug => {
                        let checkSlug = Item.findOne({where: {slug}})
                        if (checkSlug !== null) {
                            Extra.create({
                                extra_slug: slug,
                                itemId: item.id
                            })
                        }
                    })
                )
            }
            return res.status(200).json("Success")
        } catch (e) {

        }
    }

    async getBySlug(req, res, next) {
        let {slugName} = req.params
        let item = await Item.findOne({
            where: {slug: slugName},
            order: [['createdAt', 'DESC']],
            include: [
                {model: Image, as: Item.images},
                {model: Parameters, as: Item.params},
                {model: Features, as: Item.features},
                {model: Extra, as: Item.extra_slug},
            ]
        })
        return res.status(200).json(item)
    }

    async getAllShort(req, res, next) {
        let items = await Item.findAll({
            where: {},
            order: [['createdAt', 'ASC']],
            include: [
                {model: Image, as: Item.images},
                {model: Parameters, as: Item.params},
                {model: Features, as: Item.features},
                {model: Extra, as: Item.extra_slug},
            ]
        })

        items = items.map(item => {
            return {
                name: item.name,
                slug: item.slug,
                cover: item.images[0] || ''
            }
        })
        return res.status(200).json(items)
    }

    async getAll(req, res, next) {
        let items = await Item.findAll({
            where: {},
            order: [['createdAt', 'ASC']],
            include: [
                {model: Image, as: Item.images},
                {model: Parameters, as: Item.params},
                {model: Features, as: Item.features},
                {model: Extra, as: Item.extra_slug},
            ]
        })
        return res.status(200).json(items)
    }

    async editBySlug(req, res, next) {
        let {slugName} = req.params
        let changeFields = req.body
        let item = Item.findOne({where: {slug: slugName}})

        if(changeFields.name !== undefined) {
            let slugToChange = slug(changeFields.name)
            if (slugToChange !== null) return next(ApiError.forbidden("Такой товар уже существует!"))
            changeFields.slug = slugToChange
        }

        if (changeFields.extra_slug !== undefined) {
            await Extra.destroy({where: {itemId: item.id}})
            await Promise.all(
                Array.from(changeFields.extra_slug).map(slug => {
                    let checkSlug = Item.findOne({where: {slug}})
                    if (checkSlug !== null) {
                        Extra.create({
                            extra_slug: slug,
                            itemId: item.id
                        })
                    }
                })
            )
            delete changeFields.extra_slug
        }

        if (changeFields.features !== undefined) {
            await Features.destroy({where: {itemId: item.id}})
            await Promise.all(
                Array.from(changeFields.features).map(feature => {
                    Features.create({
                        header: feature.header,
                        main_text: feature.main_text,
                        circle_text: feature.circle_text,
                        itemId: item.id
                    })
                })
            )
            delete changeFields.features
        }

        if (changeFields.features !== undefined) {
            await Parameters.destroy({where: {itemId: item.id}})
            await Promise.all(
                Array.from(changeFields.params).map(param => {
                    return Parameters.create({
                        name: param.name,
                        first_opt: param.options[0],
                        second_opt: param.options[1] || '',
                        third_opt: param.options[2] || '',
                        itemId: item.id
                    })
                })
            )
            delete changeFields.features
        }

        await Item.update(
            changeFields,
            {where: {slug: slugName}}
        )
        return res.status(200).json(228)
    }

    async deleteAll(req, res, next) {
        await Image.destroy({where: {}, truncate: true})
        await Extra.destroy({where: {}, truncate: true})
        await Parameters.destroy({where: {}, truncate: true})
        await Features.destroy({where: {}, truncate: true})
        let result = await Item.destroy({where: {}, cascade: true})
        return res.status(200).json(!!result ? "success" : "error")
    }

    async deleteBySlug(req, res, next) {
        let {slugName} = req.params
        let itemToDelete = await Item.findOne({
            where: {slug: slugName},
            order: [ [ 'name', 'DESC' ]],
            include: [
                {model: Image, as: Item.images},
                {model: Parameters, as: Item.params},
                {model: Features, as: Item.features},
                {model: Extra, as: Item.extra_slug},
            ]
        })
        console.log(itemToDelete)
        let result = await Item.destroy({where: {slug: slugName}, cascade: true})
        if (!!result) {
            await Image.destroy({where: {itemId: itemToDelete.id}})
            await Extra.destroy({where: {itemId: itemToDelete.id}})
            await Parameters.destroy({where: {itemId: itemToDelete.id}})
            await Features.destroy({where: {itemId: itemToDelete.id}})
        }
        return res.status(!!result ? 200 : 403).json("OK")
    }

}

let controller = new itemController()

router.post('/create', controller.create)
router.get('/get/:slugName', controller.getBySlug)
router.get('/all/get/short', controller.getAllShort)
router.get('/all/get/full', controller.getAll)
router.patch('/edit', controller.editBySlug)
router.delete('/delete/:slugName', controller.deleteBySlug)
router.delete('/all/delete', controller.deleteAll)

module.exports = router
