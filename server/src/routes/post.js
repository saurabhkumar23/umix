////////////// require ////////////////
const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const {showMyPosts,showAllPosts,createPost,likePost,unlikePost,commentPost,deletePost,deleteCommentPost} = require('../controllers/post')
const router = express.Router()

/////////////// routes ////////////////

//SHOW MY POST
router.get('/showMyPost',requireLogin,showMyPosts)

//SHOW ALL POST
router.get('/showAllPost',requireLogin,showAllPosts)

//CREATE POST
router.post('/createPost',requireLogin,createPost)

//LIKES on a post
router.put('/like',requireLogin,likePost)

//UNLIKES on a post
router.put('/unlike',requireLogin,unlikePost)

//COMMENT on a post
router.put('/comment',requireLogin,commentPost)

//DELETE a post
router.delete('/deletePost/:postId',requireLogin,deletePost)

//DELETE a comment
router.delete('/deleteComment/:commentId',requireLogin,deleteCommentPost)

///////////// export //////////////////
module.exports = router




