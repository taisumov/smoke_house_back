const sequelize = require('../db')          // Для подключения объекта, работающего с БД
const {DataTypes} = require('sequelize')    // Для объявления типов полей

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

module.exports = {
    Item
}
