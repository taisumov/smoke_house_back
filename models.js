const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const Header = sequelize.define('header', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: '', notNull: false},
    data: {type: DataTypes.STRING(2048), defaultValue: '', notNull: false}
})

const Video = sequelize.define('video_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    src: {type: DataTypes.STRING, defaultValue: '', notNull: true},
})

const Promo = sequelize.define('promo', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING, defaultValue: '', notNull: true},
})

const Advantage = sequelize.define('advantage', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    main_photo: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    extra_photo: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    title: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    description: {type: DataTypes.STRING(2048), defaultValue: '', notNull: true},
})

const FormOrder = sequelize.define('form_order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    is_email: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const Footer = sequelize.define('footer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    type: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    value: {type: DataTypes.STRING, defaultValue: '', notNull: true},
})

const About = sequelize.define('about', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    src: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    is_src_text: {type: DataTypes.BOOLEAN, defaultValue: false, notNull: true}
})

const Reason = sequelize.define('reason', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    description: {type: DataTypes.STRING(2048), defaultValue: '', notNull: true},
    color: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    img: {type: DataTypes.STRING, defaultValue: '', notNull: true},
})

const MassMedia = sequelize.define('mass_media', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    title: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    src: {type: DataTypes.STRING, defaultValue: '', notNull: true},
})

const ProductionInfo = sequelize.define('production_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    src: {type: DataTypes.STRING, defaultValue: '', notNull: true},
})

const Feedback = sequelize.define('feedback', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    content: {type: DataTypes.STRING(2048), defaultValue: '', notNull: true},
})

const Technology = sequelize.define('technology', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    src: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    title: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    description: {type: DataTypes.STRING(2048), defaultValue: '', notNull: true},
    is_video: {type: DataTypes.BOOLEAN, defaultValue: false, notNull: true}
})

const Delivery = sequelize.define('delivery', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    header: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    type: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    value: {type: DataTypes.STRING(2048), defaultValue: '', notNull: true},
})

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, defaultValue: '', notNull: true, unique: true},
    password: {type: DataTypes.STRING, defaultValue: '', notNull: true}
})

const Visibility = sequelize.define('visibility', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    visible: {type: DataTypes.BOOLEAN, defaultValue: true, notNull: true}
})

const initHeader = async () => {
    await Header.create({name: 'title', data: ''})
    await Header.create({name: 'description', data: ''})
    await Header.create({name: 'image', data: ''})
}

const initAdvantages = async () => {
    await Advantage.create({
        main_photo: 'a568fb3a-f29f-438f-b4c4-724589f1696d.jpg',
        extra_photo: 'a568fb3a-f29f-438f-b4c4-724589f1696d.jpg',
        title: 'Заголовок',
        description: 'Описание',
    })
    await Advantage.create({
        main_photo: 'a568fb3a-f29f-438f-b4c4-724589f1696d.jpg',
        extra_photo: 'a568fb3a-f29f-438f-b4c4-724589f1696d.jpg',
        title: 'Заголовок',
        description: 'Описание',
    })
    await Advantage.create({
        main_photo: 'a568fb3a-f29f-438f-b4c4-724589f1696d.jpg',
        extra_photo: 'a568fb3a-f29f-438f-b4c4-724589f1696d.jpg',
        title: 'Заголовок',
        description: 'Описание',
    })
}

const initTechs = async () => {
    await Technology.create({
        src: '',
        title: '12345678',
        description: 'dshsfhdfhghd',
        is_video: false
    })
    await Technology.create({
        src: '',
        title: '12345678',
        description: 'dshsfhdfhghd',
        is_video: false
    })
    await Technology.create({
        src: '',
        title: '12345678',
        description: 'dshsfhdfhghd',
        is_video: false
    })
    await Technology.create({
        src: '',
        title: '12345678',
        description: 'dshsfhdfhghd',
        is_video: false
    })
    await Technology.create({
        src: '',
        title: '12345678',
        description: 'dshsfhdfhghd',
        is_video: false
    })
    await Technology.create({
        src: '',
        title: '12345678',
        description: 'dshsfhdfhghd',
        is_video: false
    })
    await Technology.create({
        src: '',
        title: '12345678',
        description: 'dshsfhdfhghd',
        is_video: false
    })
    await Technology.create({
        src: '',
        title: '12345678',
        description: 'dshsfhdfhghd',
        is_video: false
    })
    await Technology.create({
        src: '123gertwtwtwet',
        title: '',
        description: '',
        is_video: true
    })
}

const initDelivery = async() => {
    await Delivery.create({
        header: 'sdfsfadsfsfaf',
        type: 'text',
        value: 'dsdfgsdfgrwwerte'
    })
    await Delivery.create({
        header: 'sdfsfadsfsfaf',
        type: 'text',
        value: 'dsdfgsdfgrwwerte'
    })
    await Delivery.create({
        header: 'sdfsfadsfsfaf',
        type: 'text',
        value: 'dsdfgsdfgrwwerte'
    })
    await Delivery.create({
        header: 'sdfsfadsfsfaf',
        type: 'text',
        value: 'dsdfgsdfgrwwerte'
    })
    await Delivery.create({
        header: 'sdfsfadsfsfaf',
        type: 'text',
        value: 'dsdfgsdfgrwwerte'
    })
    await Delivery.create({
        header: 'sdfsfadsfsfaf',
        type: 'video',
        value: 'dsdfgsdfgrwwerte'
    })
    await Delivery.create({
        header: 'sdfsfadsfsfaf',
        type: 'video',
        value: 'dsdfgsdfgrwwerte'
    })
    await Delivery.create({
        header: 'sdfsfadsfsfaf',
        type: 'video',
        value: 'dsdfgsdfgrwwerte'
    })
}

const initReasons = async() => {
    await Reason.create({
        title: 'sdfsfasdfa',
        description: 'sdfsdfsdfsdf',
        color: 'fff',
        img: ''
    })
    await Reason.create({
        title: 'sdfsfasdfa',
        description: 'sdfsdfsdfsdf',
        color: 'fff',
        img: ''
    })
    await Reason.create({
        title: 'sdfsfasdfa',
        description: 'sdfsdfsdfsdf',
        color: 'fff',
        img: ''
    })
    await Reason.create({
        title: 'sdfsfasdfa',
        description: 'sdfsdfsdfsdf',
        color: 'fff',
        img: ''
    })
    await Reason.create({
        title: 'sdfsfasdfa',
        description: 'sdfsdfsdfsdf',
        color: 'fff',
        img: ''
    })
    await Reason.create({
        title: 'sdfsfasdfa',
        description: 'sdfsdfsdfsdf',
        color: 'fff',
        img: ''
    })
}

const initProd = async() => {
    await ProductionInfo.create({
        title: 'ddsfgsdfgsdg',
        src: ''
    })
    await ProductionInfo.create({
        title: 'ddsfgsdfgsdg',
        src: ''
    })
    await ProductionInfo.create({
        title: 'ddsfgsdfgsdg',
        src: ''
    })
    await ProductionInfo.create({
        title: 'ddsfgsdfgsdg',
        src: ''
    })
    await ProductionInfo.create({
        title: 'ddsfgsdfgsdg',
        src: ''
    })
    await ProductionInfo.create({
        title: 'ddsfgsdfgsdg',
        src: ''
    })
}

const initAboutFirst = async() => {
    await About.create({src: '', is_src_text: false})
    await About.create({src: '', is_src_text: false})
    await About.create({src: '', is_src_text: false})
    await About.create({src: '', is_src_text: false})
    await About.create({src: 'sdagasfadsfsf', is_src_text: true})
}

const initUsers = async() => {
    await User.create({
        username: 'admin',
        password: 'admin'
    })
}

const initForms = async() => {
    await FormOrder.create({
        name: 'Фамилия',
        is_email: false
    })
    await FormOrder.create({
        name: 'Имя',
        is_email: false
    })
    await FormOrder.create({
        name: 'Отчество',
        is_email: false
    })
    await FormOrder.create({
        name: 'islam.taisumov@yandex.ru',
        is_email: true
    })
}

const initVisibility = async() => {
    await Visibility.create({
        name: 'header',
        visible: true
    })
    await Visibility.create({
        name: 'promo',
        visible: true
    })
    await Visibility.create({
        name: 'advantages',
        visible: true
    })
    await Visibility.create({
        name: 'main_video',
        visible: true
    })
}

module.exports = {
    Header,
    Promo,
    Advantage,
    FormOrder,
    Video,
    Footer,
    About,
    Reason,
    MassMedia,
    ProductionInfo,
    Feedback,
    Technology,
    User,
    Delivery,
    initHeader,
    initAdvantages,
    initTechs,
    initDelivery,
    initReasons,
    initProd,
    initAboutFirst,
    initUsers,
    initForms,
    initVisibility
}
