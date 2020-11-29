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

///////////// export //////////////////
module.exports = router