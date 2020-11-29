/////////////////////// require /////////////////////
const express = require('express')
const mongoose = require('mongoose')
const {MONGO_URI} = require('./keys')
const app = express()

//////////////////////// db configuration /////////////////
mongoose.connect(MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => console.log('Database connected!'))
    .catch((error) => console.log(error))

//////////////////// routes configuration /////////////////
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post')) 
app.use(require('./routes/user'))

///////////////////////// listen to server //////////////////
const PORT = 5000;
app.listen(PORT,(req,res)=>{
    console.log(`server is running on port ${PORT}`)
})
