const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    articleTitle: String,
    articleImg: String,
    articleContent: String,
    articleDescription:String,
    articleUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
}) 

const wishlistModel = mongoose.model('wishlist', wishlistSchema)

module.exports = wishlistModel