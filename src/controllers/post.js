const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')

//********************************** SHOW MY POST ****************************//
module.exports.showMyPosts = (req,res) => {
    Post.find({postedBy : req.user._id})
    .populate('postedBy','_id name')
    .then((posts) => res.json({posts}))
    .catch((error) => res.status(404).json({error : error}))
}

//********************************** SHOW ALL POST ****************************//
module.exports.showAllPosts = (req,res) => {
    Post.find()
    .populate('postedBy','_id name photo')
    .populate('comments.postedBy','_id name')
    .sort('-createdAt')
    .then((posts) => res.json({posts}))
    .catch((error) => res.status(404).json({error : error}))
}

//********************************** SHOW A POST ****************************//
module.exports.showPost = (req,res) => {
    Post.find({_id : req.params.postId})
    .populate('postedBy','_id name')
    .then((post) => res.json({post}))
    .catch((error) => res.status(404).json({error : error}))
}

//********************************** CREATE POST ****************************//
module.exports.createPost = (req,res) => {
    //fetch data
    const {title,photo} = req.body
    //validation
    if(!title || !photo){
        return res.status(404).json({error : 'Please fill all the fields'})
    }
    //save data to DB
    const newPost = new Post({title,photo,postedBy:req.user})
    newPost.save()
    .then((post) => res.json({message : 'post created successfully!'}))
    .catch((error) => res.status(404).json({error : error}))
}

//********************************** EDIT POST ****************************//
module.exports.editPost = (req,res) => {
    const {title,photo} = req.body
    Post.findByIdAndUpdate(req.body.postid,{title,photo},{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name photo')
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
}

//********************************** lIKE POST ****************************//
module.exports.likePost = (req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {likes : req.user._id}
    },{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name photo')
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
}

//********************************** UNLIKE POST ****************************//
module.exports.unlikePost = (req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull : {likes : req.user._id}
    },{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name photo')
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
}

//********************************** COMMENT ON POST ****************************//
module.exports.commentPost = (req,res) => {
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {comments : comment}
    },{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name photo')
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
}

//********************************** DELETE POST ****************************//
module.exports.deletePost = (req,res) => {
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
}

//********************************** DELETE COMMENT ON POST ****************************//
module.exports.deleteCommentPost = (req,res) => {
    const comment = {
        _id : req.body.commentId,
        text : req.body.commentText,
        postedBy : req.body.commentPostedBy
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $pull : {comments : comment}
    },{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name photo')
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
}