const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    category: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    name: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    slug: {type: DataTypes.STRING, defaultValue: '', notNull: true, unique: true},
    video: {type: DataTypes.STRING, defaultValue: '', notNull: false},
    material: {type: DataTypes.STRING, defaultValue: '', notNull: false},
    price: {type: DataTypes.STRING, defaultValue: '', notNull: false},
})

const Image = sequelize.define('image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    src: {type: DataTypes.STRING, defaultValue: '', notNull: true},
})

const Parameters = sequelize.define('params', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    first_opt: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    second_opt: {type: DataTypes.STRING, defaultValue: ''},
    third_opt: {type: DataTypes.STRING, defaultValue: ''},
})

const Features = sequelize.define('features', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    header: {type: DataTypes.STRING, defaultValue: '', notNull: true},
    main_text: {type: DataTypes.STRING, defaultValue: ''},
    circle_text: {type: DataTypes.STRING, defaultValue: ''},
})

const Extra = sequelize.define('extra', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    extra_slug: {type: DataTypes.STRING, defaultValue: '', notNull: true},
})

Item.hasMany(Image)
Image.belongsTo(Item)

Item.hasMany(Parameters)
Parameters.belongsTo(Item)

Item.hasMany(Features)
Features.belongsTo(Item)

Item.hasMany(Extra)
Extra.belongsTo(Item)


module.exports = {
    Item,
    Image,
    Parameters,
    Features,
    Extra
}
