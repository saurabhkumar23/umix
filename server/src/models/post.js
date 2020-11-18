////////////// require ////////////////
const mongoose = require('mongoose')

// post - title, body, photo, postedBy
const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    photo : {
        type : String,
        required : true
    },
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
},{timestamps:true})

///////////// export //////////////////
module.exports = mongoose.model('post',postSchema)
