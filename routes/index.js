var express = require('express');
var router = express.Router();
var request = require('sync-request')
var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var wishlistModel = require('../models/wishlist')
var userModel = require('../models/users')



//https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=7ac9fc4a5bf54195a7934340699c34a5
router.get('/getArticles', async function(req,res,next){
  var data = request('GET',`https://newsapi.org/v2/sources?language=fr&country=fr&apiKey=7ac9fc4a5bf54195a7934340699c34a5`)
  var dataParse =JSON.parse(data.body)
  res.json({dataParse})
}) 

router.post('/screenArticlesBySource', async function(req,res,next){
  var id = req.body.id
  console.log(id)
  var data = request('GET',`https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=7ac9fc4a5bf54195a7934340699c34a5`)
  var dataParse =JSON.parse(data.body)
  res.json({dataParse})
})

router.post('/addToWhishlist', async function(req, res, next) {

//Get user id
const user = await userModel.findOne({
  token: req.body.token
})

  var data = await wishlistModel.findOne({
    articleTitle: req.body.title
  })

  if(!data) {

    var newArticle = new wishlistModel({
      articleTitle: req.body.title,
      articleImg: req.body.img,
      articleContent: req.body.content,
      articleDescription: req.body.description,
      articleUsers: user._id,
    })
  saveArticle = await newArticle.save();
  
  } else {

    if(!data.articleUsers.includes(user._id)){
      await wishlistModel.updateOne(
        { articleTitle: req.body.title},
        {$push: {articleUsers: user._id}}
       );
      data = await wishlistModel.findOne({
        articleTitle: req.body.title
      })
    } 
  }
  res.json({data})
})

router.post('/displayWishlist', async function(req, res, next) {
  const user = await userModel.findOne({
    token: req.body.token
  });
  console.log(user)
  var articles = await wishlistModel.findOne({
    articleUsers: user._id
  })
  
  res.json(articles)
})

router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

module.exports = router;
