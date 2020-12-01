////////////// require ////////////////
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET_KEY} = require('../keys')
const router = express.Router()

/////////////// routes ////////////////

// SIGNUP 
router.post('/signup',(req,res) => {
    //fetching data
    const {name,email,password,photo} = req.body
    //validation
    if(!name || !email || !password){
        return res.status(404).json({'error' : 'Please fill all the fields!'})
    }
    //check via email, if user already registered
    User.findOne({email:email})
    .then((user) => {
        //if user already exists
        if(user){
            return res.status(401).json({error : 'User already exist with that email!'})
        }
        //saving user to DB
        bcrypt.hash(password,12)
        .then((hashedPassword) => {
            const newUser = new User({name,email,password : hashedPassword,photo})
            newUser.save()
            .then((user) => res.json({message : 'User register successfully!'}))
            .catch((error) => res.status(404).json({error : error}))
        })
        .catch((error) => res.status(404).json({error : error}))
    })
    .catch((error) => res.status(404).json({error : error}))
})

// SIGNIN
router.post('/signin',(req,res) => {
    //fetching data
    const {email,password} = req.body
    //validation
    if(!email || !password){
        return res.status(404).json({'error' : 'Please add both the email and password'})
    }
    //check via email, if user not registered
    User.findOne({email:email})
    .then((user) => {
        //if user not exists
        if(!user){
            return res.status(401).json({error : 'Invalid email or password!'})
        }
        //validation
        bcrypt.compare(password,user.password)
        .then((isMatch) => {
            if(isMatch){
                //user receive the token
                const token = jwt.sign({_id:user._id},JWT_SECRET_KEY,{expiresIn:'1hr'})
                const {_id,name,email,followers,following,photo} = user
                return res.json({token,user:{_id,name,email,followers,following,photo}})
            }
            else
                return res.status(401).json({error : 'Invalid email or password!'})
        })
        .catch((error) => res.status(404).json({error : error}))
    })
    .catch((error) => res.status(404).json({error : error}))
})

///////////// export //////////////////
module.exports = router