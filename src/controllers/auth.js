const express = require('express')
const mongoose = require('mongoose')
const { check,validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
const { match } = require('assert')

const User = require('../models/user')
const {JWT_SECRET_KEY} = require('../../config/keys')
const {SENDGRID_API_KEY} = require('../../config/keys')
const user = require('../models/user')

sgMail.setApiKey(SENDGRID_API_KEY)

//********************************** SIGNUP VALIDATIONS ****************************//
module.exports.signupValidations = [
    check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({min: 2})
    .withMessage('Name must contain atleast 2 characters')
    .isLength({max: 40})
    .withMessage('Name must contain atmax 20 characters'),
    check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email should be a valid email'),
    check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min: 5})
    .withMessage('Password must contain atleast 5 characters')
    .isLength({max: 15})
    .withMessage('Password must contain atmax 15 characters')
]

//********************************** SIGNUP controller ****************************//
module.exports.signup = (req,res) => {
    //validation
    const errors = validationResult(req)
    if(errors.array().length>0){
        return res.status(400).json({error : errors.array()[0].msg})
    }
    //fetching data
    const {name,email,password,photo} = req.body
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
            .then((user) => {
                // sgMail.send({
                //     to : user.email,
                //     from : 'sauravgautam884@gmail.com',
                //     subject : `Welcome to UMIX!`,
                //     html : '<h2>we hope you enjoys our community, Have fun.</h2>',
                // })
                res.json({message : 'User register successfully!'})
            }) 
            .catch((error) => res.status(404).json({error : error}))
        })
        .catch((error) => res.status(404).json({error : error}))
    })
    .catch((error) => res.status(404).json({error : error}))
}

//********************************** SIGNIN VALIDATIONS ****************************//
module.exports.signinValidations = [
    check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email should be a valid email'),
    check('password')
    .notEmpty()
    .withMessage('Password is required')
]

//********************************** SIGNIN controller ****************************//
module.exports.signin = (req,res) => {
    //validation
    const errors = validationResult(req)
    if(errors.array().length>0){
        return res.json({error : errors.array()[0].msg})
    }
    //fetching data
    const {email,password} = req.body
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
}

//********************************** RESET-PASSWORD VALIDATIONS ****************************//
module.exports.resetPassValidations = [
    check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email should be a valid email')
]

//********************************** RESET-PASSWORD controller ****************************//
module.exports.resetPassword = (req,res) => {
    //validation
    const errors = validationResult(req)
    if(errors.array().length>0){
        return res.status(400).json({error : errors.array()[0].msg})
    }
    crypto.randomBytes(32,(err,buffer) => {
        if(err){
            return console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email : req.body.email})
        .then(user => {
            if(!user) 
                return res.status(422).json({error : 'User doesnt exist with that email'})
            user.resetToken = token
            user.expireToken = Date.now() + 1800000
            user.save()
            .then(result => {
                sgMail.send({
                    to : user.email,
                    from : 'sauravgautam884@gmail.com',
                    subject : `password reset`,
                    html : `<p>you requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/resetPass/${token}">link</a> to reset your password.</h5>`
                })
                res.json({message : 'check your email!'})
            })
            .catch((error) => res.status(404).json({error : error}))
        })
        .catch((error) => res.status(404).json({error : error}))
    }) 
}

//********************************** NEW-PASSWORD VALIDATIONS ****************************//
module.exports.newPassValidations = [
    check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min: 5})
    .withMessage('Password must contain atleast 5 characters')
    .isLength({max: 15})
    .withMessage('Password must contain atmax 15 characters')
]

//********************************** NEW-PASSWORD controller ****************************//
module.exports.newPassword = (req,res) => {
    //validation
    const errors = validationResult(req)
    if(errors.array().length>0){
        return res.status(400).json({error : errors.array()[0].msg})
    }
    const newPassword = req.body.password
    const token = req.body.token
    User.findOne({resetToken:token,expireToken:{$gt:Date.now()}})
    .then(user => {
        if(!user)
            return res.status(422).json({error : "session expired, Please try again"})
        bcrypt.hash(newPassword,12)
        .then(hashedPassword => {
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save()
            .then(result => {
                return res.json({message : "password updated successfully"})
            })
            .catch((error) => res.status(404).json({error : error}))
        })
        .catch((error) => res.status(404).json({error : error}))
    })
    .catch((error) => res.status(404).json({error : error}))
}