const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization')
    req.isAuth = false
    if (!authHeader) {
        return next()
    }
    const token = authHeader.split(' ')[1]
    if (!token || token === '') {
        return next()
    }

    let decodeToken
    try {
        decodeToken = await jwt.verify(token, 'secretKey')
    } catch (error) {
        return next()
    }
    if (!decodeToken) {
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    req.userId = decodeToken.userId
    next()
}