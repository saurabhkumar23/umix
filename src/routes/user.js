const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const {getUser,followUser,unfollowUser,updatePhoto,searchUsers} = require('../controllers/user')
const router = express.Router()

//fetch a user
router.get('/user/:id',requireLogin,getUser)

//follow user
router.put('/follow',requireLogin,followUser)

//unfollow user
router.put('/unfollow',requireLogin,unfollowUser)

//profile pic 
router.put('/updatePhoto',requireLogin,updatePhoto)

//search users 
router.post('/searchUsers',searchUsers)

module.exports = router