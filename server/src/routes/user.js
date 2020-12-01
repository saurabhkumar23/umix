////////////// require ////////////////
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()

/////////////// routes ////////////////

router.get('/user/:id',requireLogin,(req,res) => {
    //console.log('route hit ho gya bhai')
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
})

//UPDATE follow event
router.put('/follow',requireLogin,(req,res) => {
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
})

//UPDATE unfollow event
router.put('/unfollow',requireLogin,(req,res) => {
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
})

//UPDATE profile pic event
router.put('/updatePhoto',requireLogin,(req,res) => {
    User.findByIdAndUpdate(req.user._id,{
        $set : {photo : req.body.photo}
    },{new:true})
    .exec((error,result) => {
        if(error)
            return res.status(422).json({error : error})
        return res.json(result)
    })
})

///////////// export //////////////////
module.exports = router