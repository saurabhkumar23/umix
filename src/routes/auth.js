const express = require('express')
const router = express.Router()
const {signupValidations,signup,signinValidations,signin,resetPassValidations
    ,resetPassword,newPassValidations,newPassword} = require('../controllers/auth')

// SIGNUP 
router.post('/signup',signupValidations,signup)

// SIGNIN
router.post('/signin',signinValidations,signin)

// RESET PASSWORD
router.post('/resetPassword',resetPassValidations,resetPassword)

// CREATE NEW PASSWORD
router.post('/newPassword',newPassValidations,newPassword)

module.exports = router

