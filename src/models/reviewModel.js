const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = mongoose.Schema({
    bookId : {
        type: ObjectId,
        require: true,
        ref: "book"
        
    },
    reviewedBy: {
        type: String,
        require: true,
        default: 'Guest',
        value: String,
        trim: true
    },
    reviewedAt: {
       type: String,
       require: true,
       formate: Date,
       trim: true
    },
    rating: {
        type: Number,
        require: true
    },
    review: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps: true})


module.exports = mongoose.model('review', reviewSchema)