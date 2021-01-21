const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const {JWT_SECRET_KEY} = require('../../config/keys')
const User = require('../models/user')

// check authentication middleware
module.exports = (req,res,next) => {
    const {authorization} = req.headers           //fetch authorization
    if(!authorization)
        return res.status(401).json({error : 'You must logged in first!'})
    const token = authorization.replace("Bearer ","")                        //fetch token
    jwt.verify(token,JWT_SECRET_KEY,(error,payload) => {                     //verify token
        if(error)
            return res.status(401).json({error : 'You must logged in first!'})
        const {_id} = payload                                     //config req.user and allow user for access
        User.findById(_id)
        .then((user) => {
            req.user = user
            next();
        })
        .catch((error) => console.log(error))
    })
}