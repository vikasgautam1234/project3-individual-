const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')

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


const authorization = async function(req,res,next){
    try{
        

    }
    catch(error){
        return res.status(500).send({status : false , message : error.message})
    }
}


module.exports.authentication = authentication
module.exports.authorization = authorization