////////////// require ////////////////
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()

/////////////// routes ////////////////

//SHOW MY POST
router.get('/showMyPost',requireLogin,(req,res) => {
    Post.find({postedBy : req.user._id})
    .populate('postedBy','_id name')
    .then((posts) => res.json({posts}))
    .catch((error) => res.status(404).json({error : error}))
})

//SHOW ALL POST
router.get('/showAllPost',requireLogin,(req,res) => {
    Post.find()
    .populate('postedBy','_id name photo')
    .populate('comments.postedBy','_id name')
    .sort('-createdAt')
    .then((posts) => res.json({posts}))
    .catch((error) => res.status(404).json({error : error}))
})

//CREATE POST
router.post('/createPost',requireLogin,(req,res) => {
    //fetch data
    const {title,body,photo} = req.body
    //validation
    if(!title || !body || !photo){
        return res.status(404).json({error : 'Please fill all the fields'})
    }
    //save data to DB
    const newPost = new Post({title,body,photo,postedBy:req.user})
    newPost.save()
    .then((post) => res.json({message : 'post created successfully!'}))
    .catch((error) => res.status(404).json({error : error}))
})

//UPDATE LIKES on a post
router.put('/like',requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {likes : req.user._id}
    },{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name')
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
})

//UPDATE LIKES on a post
router.put('/unlike',requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull : {likes : req.user._id}
    },{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name')
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
})

//UPDATE COMMENTS on a post
router.put('/comment',requireLogin,(req,res) => {
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {comments : comment}
    },{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name')
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
})

//DELETE a post
router.delete('/deletePost/:postId',requireLogin,(req,res) => {
    Post.findOne({_id:req.params.postId})
    .populate('postedBy','_id')
    .exec((error,post) => {
        if(error)
            return res.status(422).json({error:error})
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                return res.json(result)
            })
            .catch((error) => res.status(404).json({error : error}))
        }
    })
})



///////////// export //////////////////
module.exports = router




