const jwt = require('jsonwebtoken')
const {JWT_SECRET_KEY} = require('../../config/keys')
const mongoose = require('mongoose')
const User = require('../models/user')

// check authentication middleware

module.exports = (req,res,next) => {
    //fetch authorization
    const {authorization} = req.headers
    if(!authorization)
        return res.status(401).json({error : 'You must logged in first!'})
    //fetch token
    const token = authorization.replace("Bearer ","")
    //verify token
    jwt.verify(token,JWT_SECRET_KEY,(error,payload) => {
        if(error)
            return res.status(401).json({error : 'You must logged in first!'})
        //config req.user and allow user for access
        const {_id} = payload
        User.findById(_id)
        .then((user) => {
            req.user = user
            next();
        })
        .catch((error) => console.log(error))
    })
}