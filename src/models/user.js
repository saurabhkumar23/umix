const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    followers : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'user'
        }
    ],
    following : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'user'
        }
    ],
    photo : {
        type : String,
    },
    resetToken : String,
    expireToken : Date
},{timestamps:true})

module.exports = mongoose.model('user',userSchema)
