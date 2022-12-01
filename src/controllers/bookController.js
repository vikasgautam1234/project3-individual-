const mongoose = require('mongoose')
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const { isValidObjectId } = mongoose
const validation = require('../validations/validator')


let {isEmpty , isValidISBN, isValidDate} =validation  //destructuring



//-------------------------------------CREATING BOOKS---------------------------------------------------------
let createBook = async function(req,res){
    try{
        let data = req.body;
        let{title , excerpt , userId , ISBN , category , subcategory , releasedAt} = data
        if(Object.keys(data).length ==0){
            return res.status(400).send({status : false , message : "body can not be empty"})
        }
        if(!title || !excerpt || !userId || !ISBN || !category || !subcategory || !releasedAt){
            return res.status(400).send({status : false , message : "all fields are mandatory"})
        }
        if(!isEmpty(title)){
            return res.status(400).send({status : false , message : "title is empty"})
        }
        //--------------------------------CHECKING DUPLICATE TITLE-------------------------------------------
        let duplicacyCheck = await bookModel.findOne({ title: title })
        if (duplicacyCheck) {
            return res.status(400).send({ status: false, message: "title is already present" })
        }
        if(!isEmpty(excerpt)){
            return res.status(400).send({status : false , message : "excerpt is empty"})
        }
        if(!isEmpty(userId)){
            return res.status(400).send({status : false , message : "userId is empty"})
        }
        if(!isValidObjectId(userId)){
            return res.status(400).send({status : false , message : "userId is invalid"})
        }
        let findUserId = await userModel.findById(userId)
        if (!findUserId) {
            return res.status(400).send({ status: false, message: "User id does not exist" })
        }
        if(!isEmpty(ISBN)){
            return res.status(400).send({status : false , message : "ISBN is empty"})
        }
        //----------------------------CHECKING THE VALIDATION & DUPLICACY OF ISBN ----------------------------------
        if(!isValidISBN(ISBN)){
            return res.status(400).send({status : false , message : "ISBN is invalid"})
        }
        let ISBNDuplicacy = await bookModel.findOne({ ISBN: ISBN })
        if (ISBNDuplicacy) {
            return res.status(400).send({ status: false, message: "ISBN alredy exists" })
        }
        if(!isEmpty(category)){
            return res.status(400).send({status : false , message : "category is empty"})
        }
        if(!isEmpty(subcategory)){
            return res.status(400).send({status : false , message : "subcategory is empty"})
        }
        //-----------------------------DATE VALIDATION & EMPTYNESS----------------------------------------
        if(!isEmpty(releasedAt)){
            return res.status(400).send({status : false , message : "releasedAt is empty"})
        }
        if(!isValidDate(releasedAt)){
            return res.status(400).send({status : false , message : "invalid date(YY-MM-dd)"})
        }
        //----------------------CREATING BOOKS -------------------------------------------------------------
        let bookData = await bookModel.create(data)
        return res.status(201).send({status : true , message : "books created successfully", data : bookData})
    }
    catch(error){
        return res.status(500).send({status : false , message : error.message})
    }
}


module.exports.createBook = createBook