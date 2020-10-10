const express = require('express')
const app=express()

const PORT=process.env.PORT || 5000
app.use(express.json())
require('./models/user')
require('./models/post')
app.use(require('./routes/auth'))
app.use(require('./routes/createpost'))
app.use(require('./routes/user'))

const {MONGOURI}=require('./config/keys')
const mongoose=require('mongoose')

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("Connected with mongoDB")
})
mongoose.connection.on('error',(err)=>{
    console.log("Error connecting with mongoDB ",err)
})

if(process.env.NODE_ENV==='production')
{
    app.use(express.static('client/build'))
    const path=require('path')
    console.log("Required")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
        
    })
}

app.listen(PORT,()=>{
    console.log("server is running")
})

