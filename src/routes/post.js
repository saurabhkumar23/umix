const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const {showMyPosts,showAllPosts,showPost,createPost,editPost
    ,likePost,unlikePost,commentPost,deletePost,deleteCommentPost} = require('../controllers/post')
const router = express.Router()

//SHOW MY POST
router.get('/showMyPost',requireLogin,showMyPosts)

//SHOW ALL POST
router.get('/showAllPost',requireLogin,showAllPosts)

//SHOW POST by ID
router.get('/show/:postId',requireLogin,showPost)

//CREATE POST
router.post('/createPost',requireLogin,createPost)

//EDIT POST
router.put('/editPost',requireLogin,editPost)

//LIKES on a post
router.put('/like',requireLogin,likePost)

//UNLIKES on a post
router.put('/unlike',requireLogin,unlikePost)

//COMMENT on a post
router.put('/comment',requireLogin,commentPost)

//DELETE a post
router.delete('/deletePost/:postId',requireLogin,deletePost)

//DELETE a comment
router.put('/deleteComment',requireLogin,deleteCommentPost)

module.exports = router




