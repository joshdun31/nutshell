const mongoose = require('mongoose')
const {ObjectId}=mongoose.Schema.Types

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true,
        default:"No bio"
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    profilePic:{
        type:"String",
        required:true,
        default:"https://www.iconfinder.com/data/icons/people-80/96/Picture1-512.png"
    }
})

mongoose.model('User',userSchema)