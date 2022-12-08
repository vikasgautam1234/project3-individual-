const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const validation = require('../validations/validator')
const { default: mongoose } = require('mongoose')
const { isValidObjectId } = mongoose

let { isValidName, isFilled } = validation

//---------------------------------CREATE REVIEWS FOR BOOKS-----------------------------------------------------------

const createReview = async function (req, res) {
    try {
        let bodyData = req.body
        let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = bodyData
        if (Object.keys(bodyData).length == 0) {
            return res.status(400).send({ status: false, message: "body can not be empty" })
        }
        let BookId = req.params.bookId
        if (!isValidObjectId(BookId)) {
            return res.status(400).send({ status: false, message: "invalid bookId" })
        }
        const findBook = await bookModel.findById(bookId)
        if (!findBook) {
            return res.status(404).send({ status: false, message: "The book you want to review is not exist!" })
        }
        if (findBook.isDeleted == true) {
            return res.status(400).send({ status: false, message: "The book you want to review is deleted!" })
        }
        if (!reviewedBy) {
            bodyData.reviewedBy = "Guest"  // if reviewedBy is not present then default Guest must be written
        }
        if (!isFilled(reviewedBy)) {
            bodyData.reviewedBy = "Guest"  // if reviewedBy is empty then default Guest must be written
        }
        if (!isValidName(reviewedBy)) {
            bodyData.reviewedBy = "Guest"   // if reviewedBy(name) is not valdid then default Guest must be written
        }
        if (rating) rating = rating.toString() // want rating is string is req.body
        if (!rating || !review) {
            return res.status(400).send({ status: false, message: "Please provide all attributes." })
        }
        if (!isFilled(rating) || !isFilled(review)) {
            return res.status(400).send({ status: false, send: "value of all the attributes must be present" })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "Rating range should in between 1 to 5." })
        }
        let createReview = await reviewModel.create(bodyData)    //this will create the bookReview 
        let updateReview = await bookModel.findOneAndUpdate(
            { _id: BookId, isDeleted: false },             // this will update the bookReview by 1 at bookModel
            { $inc: { reviews: 1 } },
            { new: true })

        let reviewData = {
            _id: createReview._id,
            bookId: createReview.bookId,
            reviewedBy: createReview.reviewedBy,
            reviewedAt: createReview.reviewedAt,
            rating: createReview.rating,
            review: createReview.review
        }
        const reviewDetail = {
            title: findBook.title,
            excerpt: findBook.excerpt,
            userId: findBook.userId,
            ISBN: findBook.ISBN,
            category: findBook.category,
            subcategory: findBook.subcategory,
            reviews: findBook.reviews + 1,
            reviewsData: reviewData
        }
        res.status(201).send({ status: true, message: "success", data: reviewDetail })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//---------------------------------------------UPDATE REVIEW--------------------------------------------------------

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "invalid bookId" })
        }
        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "invalid reviewId" })
        }
        let checkBook = await bookModel.findById(bookId)
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "No book found with this Id" })
        }
        if (checkBook.isDeleted == true) {
            return res.status(400).send({ status: false, message: "book with this Id is alredy deleted" })
        }

        let checkReview = await reviewModel.findById(reviewId)
        if (!checkReview) {
            return res.status(404).send({ status: false, message: "No review found with this Id" })
        }
        if (checkReview.isDeleted == true) {
            return res.status(400).send({ status: false, message: "the review with this Id is already deleted" })
        }
        const bookIdfrmReview = checkReview.bookId

        if (bookIdfrmReview != bookId) {
            return res.status(400).send({ status: false, message: "This Book has no review." })
        }

        let bodyData = req.body
        let { review, rating, reviewedBy } = bodyData
        if (Object.keys(bodyData).length == 0) {
            return res.status(400).send({ status: false, message: "body can not be empty." })
        }
        if (!review || !rating || !reviewedBy) {
            return res.status(400).send({ status: false, message: "all fields are mandatory" })
        }
        if (rating) rating = rating.toString()
        if (!isFilled(review) || !isFilled(rating) || !isFilled(reviewedBy)) {
            return res.status(400).send({ status: false, message: "rating/review/reviewedBy can not be empty" })
        }
        if (![1, 2, 3, 4, 5].includes(bodyData.rating)) {
            return res.status(400).send({ status: false, message: "Give a rating between 1 to 5(not in decimals)" })
        }
        const reviewupdate = await reviewModel.findOneAndUpdate(
            { _id: reviewId, bookId: bookId },
            { $set: { reviewedBy: reviewedBy, rating: rating, review: review } },
            { new: true }
        )
        let finalData = {
            title: checkBook.title,
            excerpt: checkBook.excerpt,
            userId: checkBook.userId,
            category: checkBook.category,
            subcategory: checkBook.subcategory,
            isDeleted: false,
            reviews: checkBook.reviews,
            reviewsData: reviewupdate
        }
        res.status(200).send({ status: true, msg: "updated", data: finalData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
const deleteReview = async (req, res) => {
    try{
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId
    if (!isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "invalid bookId" })
    }
    if (!isValidObjectId(reviewId)) {
        return res.status(400).send({ status: false, message: "invalid reviewId" })
    }
    let checkBook = await bookModel.findById(bookId)
    if (!checkBook) {
        return res.status(404).send({ status: false, message: "No book found with this Id" })
    }
    if (checkBook.isDeleted == true) {
        return res.status(400).send({ status: false, message: "book with this Id is alredy deleted" })
    }

    let checkReview = await reviewModel.findById(reviewId)
    if (!checkReview) {
        return res.status(404).send({ status: false, message: "No review found with this Id" })
    }
    if (checkReview.isDeleted == true) {
        return res.status(400).send({ status: false, message: "the review with this Id is already deleted" })
    }
    const bookIdfrmReview = checkReview.bookId

    if (bookIdfrmReview != bookId) {
        return res.status(400).send({ status: false, message: "This Book has no review." })
    }
let removeReview = await reviewModel.findOneAndUpdate({_id: reviewId , isDeleted: false},{$set:{isDeleted: true}},{new: true})
let deleteBookReview = await bookModel.findOneAndUpdate({_id:bookId, isDeleted: false},{$inc:{reviews: -1}},{new:true})
return res.status(200).send({status: true, message: "review deleted successfully", data: removeReview})
    }
    catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview