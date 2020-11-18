////////////// require ////////////////
const mongoose = require('mongoose')

// user - name, email, password
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
    }
},{timestamps:true})

///////////// export //////////////////
module.exports = mongoose.model('user',userSchema)
