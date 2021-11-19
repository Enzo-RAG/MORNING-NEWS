const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    langage: String
})

const userModel = mongoose.model('users', userSchema)

const wishlistSchema = mongoose.Schema({
    articleTitle: String,
    articleImg: String,
    articleContent: String,
    articleDescription:String,
    articleUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
}) 

const wishlistModel = mongoose.model('wishlist', wishlistSchema)

module.exports = {wishlistModel, userModel}