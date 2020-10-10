const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')

const app=express()
require('../models/user')
const User=mongoose.model("User")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../config/keys')
const requestLogin =require('../middleware/requestLogin')


// router.get('/',(req,res)=>{
//     const path=require('path')
//     res.sendFile(path.resolve(__dirname,'client','build','index.html'))
// })

router.get('/protected',requestLogin,(req,res)=>{
    res.send("Welcome user")
})

router.post('/signup',(req,res)=>{
    const {name,email,password}=req.body
    if(!name || !email || !password)
    {
        return res.json({error:"Please fill all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser)
        {
            return res.status(422).json({message:"Email already exits"})
        }
        bcrypt.hash(password,12)
        .then(hashedPassword =>{
            const user=new User({
                name,email,
                password:hashedPassword
            })
            user.save()
            .then(user => {
                res.json({message:"Signup successful"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password)
    {
        return res.status(422).json({error:"Please enter both email and password"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser)
        {
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch)
            {
                //res.json({message:"Login Successful"})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name}=savedUser
                res.json({token,user:savedUser,message:"Login successful"})
            }
            else
            {
                return res.status(422).json({error:"Invalid Email or Password"})
            }    
        })
        .catch(err=>{
            console.log(err)
            res.send("<h1>"+{err}+"</h1>")
        })
        })
})

router.put('/updateprofile',requestLogin,(req,res)=>{
    const {name,bio,email,profilePic}=req.body
    if(!name || !bio || !email || !profilePic)
    {
        return res.status(422).json({error:"Enter both name and bio"})
    }
    User.updateMany({_id:req.user._id},
        {
            $set:{name:name,bio:bio,email:email,profilePic:profilePic}
        },{
            new:true
        })
    .exec((err,result)=>{
        if(err)
        {
            return res.status(422).json({error:err})
        }
        User.findOne({_id:req.user._id})
        .then((savedUser)=>{
            return res.json({message:"Profile Updated",result:savedUser})
        })
            
    })
})

router.put('/follow',requestLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

router.put('/unfollow',requestLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })
    }
    )
})

module.exports = router