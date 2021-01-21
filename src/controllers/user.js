const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')

//********************************** GET USER ****************************//
module.exports.getUser = (req,res) => {
    User.findOne({_id : req.params.id})
    .select('-password')
    .then(user => {
        Post.find({postedBy : req.params.id})
        .populate('postedBy','_id name')
        .exec((error,posts) => {
            if(error)
                return res.status(422).json({error:error})
            return res.json({user,posts})
        })
    })
    .catch(error =>  res.status(404).json({error:'User not found!'}))
}

//********************************** FOLLOW USER ****************************//
module.exports.followUser = (req,res) => {
    User.findByIdAndUpdate(req.body.followId,{
        $push : {followers : req.user._id}
    },{new:true})
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        User.findByIdAndUpdate(req.user._id,{
            $push : {following : req.body.followId}
        },{new:true})
        .select('-password')
        .exec((error,result) => {
            if(error)
                return res.status(422).json({error : error})
            return res.json(result)
        })
    })
}

//********************************** UNFOLLOW USER ****************************//
module.exports.unfollowUser = (req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull : {followers : req.user._id}
    },{new:true})
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        User.findByIdAndUpdate(req.user._id,{
            $pull : {following : req.body.unfollowId}
        },{new:true})
        .select('-password')
        .exec((error,result) => {
            if(error)
                return res.status(422).json({error : error})
            return res.json(result)
        })
    })
}

//********************************** UPDATE USER PROFILE PIC ****************************//
module.exports.updatePhoto = (req,res) => {
    User.findByIdAndUpdate(req.user._id,{
        $set : {photo : req.body.photo}
    },{new:true})
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
}

//********************************** GET ALL SEARCHED USERS ****************************//
module.exports.searchUsers = (req,res) => {
    let userPattern = new RegExp('^'+req.body.data)
    User.find({name : {$regex:userPattern}})
    .select('_id name email')
    .then(users => {
        return res.json(users)
    })
    .catch(error =>  res.status(422).json({error}))
}