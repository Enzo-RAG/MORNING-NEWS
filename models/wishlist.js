const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    articleTitle: String,
    articleImg: String,
    articleContent: String,
    articleDescription:String,
    userId: String
})

const wishlistModel = mongoose.model('wishlist', wishlistSchema)

module.exports = wishlistModel