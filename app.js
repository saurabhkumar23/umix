/////////////////////// require /////////////////////
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const {MONGO_URI} = require('./config/keys')
const app = express();

//////////////////////// db configuration /////////////////
mongoose.connect(MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => console.log('Database connected!'))
    .catch((error) => console.log(error))

//////////////////// routes configuration /////////////////
app.use(express.json())
app.use(require('./src/routes/auth'))
app.use(require('./src/routes/post')) 
app.use(require('./src/routes/user'))

//if application is in production, serve static files
if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'))
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

///////////////////////// listen to server //////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT,(req,res)=>{
    console.log(`server is running on port ${PORT}`)
})

