const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const route = require('./routes/router')
app.use(express.json())


mongoose.connect(process.env.MongoURL, {useNewUrlParser : true})
.then(()=>console.log("mongodb connected"))
.catch((err)=>console.log(err))


app.use('/', route)

app.listen(process.env.PORT , ()=>{
    console.log("server started in port "+ process.env.PORT)
})


