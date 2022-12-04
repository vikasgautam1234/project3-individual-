const mongoose = require('mongoose')
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const { isValidObjectId } = mongoose
const validation = require('../validations/validator')


let {isFilled , isValidISBN, isValidDate} =validation  //destructuring



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
        if(!isFilled(title)){
            return res.status(400).send({status : false , message : "title is empty"})
        }
        //--------------------------------CHECKING DUPLICATE TITLE & ISBN BY SINGLE DB CALL-------------------------------------------
        
        let unique = await bookModel.findOne({$or: [{title: title}, {ISBN: ISBN}]})
        if(unique){
            if(unique.title == title){
                return res.status(400).send({status : false , message : "this title already exists"})
            }
        }
        if(!isValidISBN(ISBN)){
            return res.status(400).send({status : false , message : "ISBN is invalid"})
        }
        if(unique){
            if(unique.ISBN === ISBN){
                return res.status(400).send({status : false , message : "this ISBN already exists"})
            }
        }
        if(!isFilled(excerpt)){
            return res.status(400).send({status : false , message : "excerpt is empty"})
        }
        if(!isFilled(userId)){
            return res.status(400).send({status : false , message : "userId is empty"})
        }
        if(!isValidObjectId(userId)){
            return res.status(400).send({status : false , message : "userId is a invalid"})
        }
        let findUserId = await userModel.findById(userId)
        if (!findUserId) {
            return res.status(400).send({ status: false, message: "User id does not exist" })
        }
        if(!isFilled(ISBN)){
            return res.status(400).send({status : false , message : "ISBN is empty"})
        }
        if(!isFilled(category)){
            return res.status(400).send({status : false , message : "category is empty"})
        }
        if(!isFilled(subcategory)){
            return res.status(400).send({status : false , message : "subcategory is empty"})
        }
        //-----------------------------DATE VALIDATION & EMPTYNESS----------------------------------------
        if(!isFilled(releasedAt)){
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
//-------------------------------------------GET BOOKS FROM QUERY---------------------------------------------

const getBooksFromQuery = async function(req,res){
    try{
        let queryData = req.query;

      if(queryData.userId === ""){
        return res.status(400).send({status : false , message : "userId can not be empty"})
     }
     if(queryData.category === ""){
        return res.status(400).send({status : false , message : "category can not be empty"})
     }
     if(queryData.subcategory === ""){
        return res.status(400).send({status : false , message : "subcategory can not be empty"})
     }
     queryData["isDeleted"] = false  //adding isDeleted attribute is querydata
     let bookData = await bookModel.find(queryData).select({title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1}).sort({ title: 1 })
     //sort({ title: 1 }) this will go as A->Z .....sort({ title: -1 }) will go Z ->A

     if(bookData.length ==0){
        return res.status(404).send({status: false , message: "no book found"})
     }
     return res.status(200).send({status: true, message : "Books list" , Data: bookData })
    }
    catch(error){
        return res.status(500).send({status : false , message : error.message})
    }
}
//------------------------------GET BOOKS BY PATH PARAMS -------------------------------------------------------

const getBookById = async function(req,res){
    try{
        const bookId = req.params.bookId;
         if(!bookId){
            return res.status(400).send({status: false, message : "bookId is required" })
         }
         if(!isValidObjectId(bookId)){
            return res.status(400).send({status : false , message: "invalid bookId"})
         }
         const bookData = await bookModel.findById(bookId)
         if(!bookData){
            return res.status(404).send({status: false, message : "No book found with this Id" })
         }
         if(bookData.isDeleted == true){
            return res.status(400).send({status : false , message: " this book is already deleted"})
         }
         let reviewsData = await reviewModel.find({bookId: bookId , isDeleted: false}).select({isDeleted : 0, createdAt : 0, updatedAt : 0, __v : 0})
         let booksData = {
            _id: bookData.id,
            title: bookData.title,
            excerpt: bookData.excerpt,
            userId: bookData.userId,
            category: bookData.category,
            subcategory: bookData.subcategory,
            isDeleted: bookData.isDeleted,
            reviews: bookData.reviews,
            releasedAt: bookData.releasedAt,
            createdAt: bookData.createdAt,
            updatedAt: bookData.updatedAt,
            reviewsData: reviewsData

         }
         return res.status(200).send({status : true, message: "books list", data: booksData })

    }
    catch(error){
        return res.status(500).send({status: false , message: error.message})
    }
}
//-----------------------------------------UPDATE BOOK----------------------------------------------------------
const updateBook = async function(req,res){
    try{
       let bookId = req.params.bookId
       let data = req.body
       let{title,excerpt,releasedAt,ISBN} = data
       if(Object.keys(data).length == 0){
        return res.status(400).send({status : false , message: "body can not be empty"})
       }
       if(!title || !excerpt || !releasedAt || !ISBN){
        return res.status(400).send({status : false , message: "The value field can not be empty"})
       }
       if(title){
        if(!isFilled(title)){
            return res.status(400).send({status : false , message: "title is required"})
        }
       }
       if(excerpt){
        if(!isFilled(excerpt)){
            return res.status(400).send({status : false , message: "excerpt is required"})
        }
       }
       if(releasedAt){
        if(!isFilled(releasedAt)){
            return res.status(400).send({status : false , message: "date is required"})
        }
        if(!isValidDate(releasedAt)){
            return res.status(400).send({status : false , message: "invalid date formate"})
        }
       }
       if(ISBN){
        if(!isFilled(ISBN)){
            return res.status(400).send({status : false , message: "ISBN is required"})
        }
        if(!isValidISBN(ISBN)){
            return res.status(400).send({status : false , message: "invalid ISBN"})
        }
       }
      let unique = await bookModel.findOne({$or:[ {title: title}, {ISBN:ISBN}]}) 
      if(unique){
        if(unique.title == title){
            return res.status(400).send({status : false , message: "can not save the same title"})
        }
        if(unique.ISBN == ISBN){
            return res.status(400).send({status : false , message: "can not save the same ISBN"})
        }
      }
       let updateTheBooks = await bookModel.findByIdAndUpdate({_id: bookId},
        {$set: {
            title: title,
            excerpt: excerpt,
            ISBN: ISBN,
            releasedAt: releasedAt
        }},{new:true}) // {new : true } will send the updated data at the response body 
        return res.status(200).send({status : true, message: "success", data: updateTheBooks})
    }
    catch(error){
        return res.status(500).send({status : false , message: error.message})
    }
}
const deleteBook = async function(req,res){
    try{
       let bookId = req.params.bookId
       let deleteByBookId = await bookModel.findOneAndUpdate({_id: bookId, isDeleted:false},{isDeleted: true, deletedAt: Date.now()},{new: true})
       let deleteReview = await reviewModel.updateMany({bookId: bookId, isDeleted: false},{$set: {isDeleted: true}})
       if(!deleteByBookId){
        return res.status(404).send({status : false , message: "this book doesn't exist"})
       }
       const deleteData = {
        title: deleteByBookId.title,
        excerpt: deleteByBookId.excerpt,
        userId: deleteByBookId.userId,
        ISBN: deleteByBookId.ISBN,
        category: deleteByBookId.category,
        subcategory: deleteByBookId.subcategory,
        reviews: 0,
        isDeleted: deleteByBookId.isDeleted,
        deletedAt: deleteByBookId.deletedAt,
        releasedAt: deleteByBookId.releasedAt
    };
    return res.status(200).send({status: false , message: "book deleted successfully", Data: deleteData})
    }
    catch(error){
        return res.status(500).send({status : false, message: error.message})
    }
}

module.exports.createBook = createBook
module.exports.getBooksFromQuery = getBooksFromQuery
module.exports.getBookById = getBookById
module.exports.updateBook = updateBook
module.exports.deleteBook = deleteBook