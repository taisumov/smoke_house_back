const Router = require('express')
const router = new Router()
const slug = require('slug')
const {Item, Image, Parameters, Features, Extra} = require('../itemModels')

const ApiError = require('../errors/ApiError')
const {authToken} = require("../middleware/auth");
const fs = require("fs");

class itemController {

    async create(req, res, next) {
        try {
            const {category, name, images, video, parameters, material, features, extra_slugs, price, visible} = req.body
            if(name !== undefined && name.length < 3) return next(ApiError.forbidden('Некорректное имя'))
            const slugName = slug(name)
            const isSlug = await Item.findOne({where: {slug: slugName}})
            if (!!isSlug) return next(ApiError.forbidden('Смените имя, чтобы товар можно было однозначно определить (имя повторяется)'))
            let parametersItems = []

            parameters.map(one_param => parametersItems.push({
                name: one_param.name,
                options: [
                    one_param.first_opt,
                    one_param.second_opt,
                    one_param.third_opt,
                ].filter(item => item !== undefined)
            }))

            const item = await Item.create({
                name,
                slug: slugName,
                video,
                material,
                category,
                price,
                visible
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
        const isAllowed = res.locals.isauth
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
        return res.status(200).json(!isAllowed ? (!!item.visible ? item : null) : item)
    }

    async getCategoryShort(req, res, next) {
        const isAllowed = res.locals.isauth
        let {category} = req.body
        let items = await Item.findAll({
            where: category === 'all' ? !isAllowed ? {visible: true} : {} : !isAllowed ? {visible: true, category} : {category},
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
                category: item.category,
                slug: item.slug,
                cover: item.images[0] || '',
                price: item.price
            }
        })
        return res.status(200).json(items)
    }

    async getAllShort(req, res, next) {
        const isAllowed = res.locals.isauth
        let items = await Item.findAll({
            where: !isAllowed ? {visible: true} : {},
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
                category: item.category,
                name: item.name,
                slug: item.slug,
                cover: item.images[0] || ''
            }
        })
        return res.status(200).json(items)
    }

    async getAll(req, res, next) {
        const isAllowed = res.locals.isauth
        let items = await Item.findAll({
            where: !isAllowed ? {visible: true} : {},
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
        const {category, name, images, video, parameters, material, features, extra_slugs, price, checkSlug, visible} = req.body
        let oldItem = await Item.findOne({where: {slug: checkSlug}})
        let slugName = checkSlug
        if(name !== undefined) {
            let slugToChange = slug(name)
            let checkItem = await Item.findOne({where: {slug: slugToChange}})
            if (checkItem && checkItem.slug !== checkSlug) return next(ApiError.forbidden("Такой название товара уже существует!"))
            slugName = slugToChange
        }

        let result = await Item.destroy({where: {slug: checkSlug}, cascade: true})
        if (!!result) {
            await Extra.destroy({where: {extra_slug: checkSlug}})
            await Image.destroy({where: {itemId: oldItem.id}})
            await Extra.destroy({where: {itemId: oldItem.id}})
            await Parameters.destroy({where: {itemId: oldItem.id}})
            await Features.destroy({where: {itemId: oldItem.id}})
        }

        let parametersItems = []

        parameters.map(one_param => parametersItems.push({
            name: one_param.name,
            options: [
                one_param.first_opt,
                one_param.second_opt,
                one_param.third_opt,
            ].filter(item => item !== undefined)
        }))

        const item = await Item.create({
            name,
            slug: slugName,
            video,
            material,
            category,
            price,
            visible: !!visible
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

        return res.status(200).json(item)
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

        itemToDelete.images.map((item) => {
            fs.unlink(`${item}`, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Файл удалён");
                }
            });
        })

        let result = await Item.destroy({where: {slug: slugName}, cascade: true})
        if (!!result) {
            await Extra.destroy({where: {extra_slug: slugName}})
            await Image.destroy({where: {itemId: itemToDelete.id}})
            await Extra.destroy({where: {itemId: itemToDelete.id}})
            await Parameters.destroy({where: {itemId: itemToDelete.id}})
            await Features.destroy({where: {itemId: itemToDelete.id}})
        }
        return res.status(!!result ? 200 : 403).json("OK")
    }

    async getCatalog(req, res, next) {
        const isAllowed = res.locals.isauth
        let items = await Item.findAll({
            where: !isAllowed ? {visible: true} : {},
            order: [['createdAt', 'ASC']],
            include: [
                {model: Image, as: Item.images},
                {model: Parameters, as: Item.params},
                {model: Features, as: Item.features},
                {model: Extra, as: Item.extra_slug},
            ]
        })

        let result = {}
        for (let item of items) {
            if(item.category !== undefined) {
                if (result[item.category] === undefined) {
                    result[item.category] = []
                }
                result[item.category].push(item)
            }
        }

        return res.status(200).json(result)
    }
}

let controller = new itemController()

router.post('/create', authToken, controller.create)
router.post('/all/get/category', controller.getCategoryShort)
router.post('/edit', authToken, controller.editBySlug)
router.delete('/delete/:slugName', authToken, controller.deleteBySlug)
router.delete('/all/delete', authToken, controller.deleteAll)
router.get('/get/:slugName', controller.getBySlug)
router.get('/all/get/short', controller.getAllShort)
router.get('/all/get/full', controller.getAll)
router.get('/all/get/catalog', controller.getCatalog)

module.exports = router
