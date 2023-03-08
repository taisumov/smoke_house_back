const Router = require('express')
const router = new Router()
const itemRouter = require('./itemRouter')
const headerRouter = require('./headerRouter')
const mediaRouter = require('./media/mediaRouter')
const promoRouter = require('./promoRouter')
const advantageRouter = require('./pages/advantageRouter')
const formOrderRouter = require('./main/formOrderRouter')
const videoRouter = require('./media/videoRouter')
const footerRouter = require('./main/footerRouter')
const aboutRouter = require('./pages/aboutRouter')
const reasonRouter = require('./main/reasonRouter')
const massMediaRouter = require('./massMediaRouter')
const productionInfoRouter = require('./productionInfoRouter')
const feedbackRouter = require('./feedbackRouter')
const techRouter = require('./techRouter')
const loginRouter = require('./auth/loginRouter')
const mailRouter = require('./mailing/mailRouter')
const deliveryRouter = require('./deliveryRouter')
const {isAuthUser} = require("../middleware/auth");
const {
    initHeader,
    initAdvantages,
    initTechs,
    initDelivery,
    initReasons,
    initProd,
    initAboutFirst,
    initUsers,
    initForms,
    initVisibility, User
} = require("../models");

router.get('/init_db', async (req, res, next) => {
    const user = await User.findOne({where: {}})
    if (user) {
        return res.status(400).json('Не получилось инициализировать БД...')
    } else {
        await initHeader()
        await initAdvantages()
        await initTechs()
        await initDelivery()
        await initReasons()
        await initProd()
        await initAboutFirst()
        await initUsers()
        await initForms()
        await initVisibility()
        return res.status(200).json("Готово!")
    }
})

router.use('/item', isAuthUser, itemRouter)
router.use('/header', isAuthUser, headerRouter)
router.use('/promo', isAuthUser, promoRouter)
router.use('/advantages', isAuthUser, advantageRouter)
router.use('/forms', isAuthUser, formOrderRouter)
router.use('/video', isAuthUser, videoRouter)
router.use('/footer', isAuthUser, footerRouter)
router.use('/about', isAuthUser, aboutRouter)
router.use('/reasons', isAuthUser, reasonRouter)
router.use('/massmedia', isAuthUser, massMediaRouter)
router.use('/prodinfo', isAuthUser, productionInfoRouter)
router.use('/feedback', isAuthUser, feedbackRouter)
router.use('/tech', isAuthUser, techRouter)
router.use('/login', isAuthUser, loginRouter)
router.use('/mail', isAuthUser, mailRouter)
router.use('/delivery', isAuthUser, deliveryRouter)
router.use('/media', isAuthUser, mediaRouter)

module.exports = router
