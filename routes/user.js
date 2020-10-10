const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
require('../models/user')
const User=mongoose.model("User")
const requestLogin =require('../middleware/requestLogin')
require('../models/post')
const Post=mongoose.model("Post")


router.get('/otherspost/:userId',requestLogin,(req,res)=>{
    User.findOne({_id:req.params.userId})
    .select("-password")
    .then(user=>{
         Post.find({postedby:req.params.userId})
         .populate("postedby","_id name profilePic")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({name:user.name,bio:user.bio,profilePic:user.profilePic,followers:user.followers,following:user.following,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.post('/search-user',requestLogin,(req,res)=>{
    let pattern=new RegExp('^'+req.body.query)
    User.find({name:{$regex:pattern,$options:'i'}})
    .select('_id name profilePic')
    .then(user=>{
        res.json(user)
    })
})

module.exports = router