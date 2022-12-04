const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')
const { isValidObjectId } = require('mongoose')

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        // console.log(token)
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

        jwt.verify(token, "top-secret-token", function (err, decodedToken) {
            if (err) {
                return res.status(400).send({ status: false, msg: "token invalid" })
            } else {
                req.token = decodedToken
                next()
            }
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, key: error.message });
    }
}


const authorization = async function (req, res, next) {
    try {
        let userId = req.body.userId
        let userIdFromDecodedToken = req.token.userId

        if (userId != userIdFromDecodedToken) {
            return res.status(403).send({ status: false, message: "access denied(unauthorised)" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const authoriseForUpdate = async function (req, res, next) {
    try {
        let bookId = req.params.bookId
        if (!bookId) {
            return res.status(400).send({ status: false, message: "please enter bookId" })
        }
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "invalid bookId" })
        }
        let bookData = await bookModel.findById(bookId)
        if (!bookData) {
            return res.status(404).send({ status: false, message: "this bookId doesn't exist" })
        }
        if (bookData.isDeleted == true) {
            return res.status(400).send({ status: false, message: "The book with this Id is already Deleted!" })
        }
        let userId = bookData.userId.toString()
        let userIdFromDecodedToken = req.token.userId;

        if (userId != userIdFromDecodedToken) {
            return res.status(403).send({ status: false, message: "access denied(unauthorised user)" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.authentication = authentication
module.exports.authorization = authorization
module.exports.authoriseForUpdate = authoriseForUpdate