const ApiError = require('../errors/ApiError')

module.exports = function (err, req, res, next) {
    return (err instanceof ApiError)
        ? res.status(err.status).json({message: err.message})
        : res.status(500).json({message: 'Непредвиденная ошибка!'})
}