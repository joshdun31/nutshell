const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const requestLogin =require('../middleware/requestLogin')

require('../models/post')
const Post=mongoose.model("Post")

router.post('/createpost',requestLogin,(req,res)=>{
    const {body,photo}=req.body
    if(!photo || !body)
    {
        return res.status(422).json({error:"Please fill both title and body of the post"})
    }
    const post=new Post({
        body,
        photo,
        postedby:req.user,
        $currentDate:{
            postedTime:true
        }
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/allpost',requestLogin,(req,res)=>{
    Post.find()
    .populate("postedby","_id name profilePic")
    .populate("comments.commentBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requestLogin,(req,res)=>{
    Post.find({postedby:req.user._id})
    .populate("postedby","_id name")
    .then(mypost=>{
        res.json({mypost,name:req.user.name,bio:req.user.bio,profilePic:req.user.profilePic,followers:req.user.followers,following:req.user.following})
    })
    .catch(err=>{
        console.log(err)
    })
})

// ,name:req.user.name,bio:req.user.bio,profilePic:req.user.profilePic

router.put('/like',requestLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,
    {
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        {
            return res.status(422).json({error:err})
        }
    })
})

router.put('/unlike',requestLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,
    {
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        {
            return res.status(422).json({error:err})
        }
    })
})

router.put('/comment',requestLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        commentBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,
    {
        $push:{comments:comment}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        {
            return res.status(422).json({error:err})
        }
    })
})

router.delete('/deletepost/:postId',requestLogin,(req,res)=>{
    Post.findOneAndRemove({_id:req.params.postId},function(err,result){
        if(err)
        {
            console.log(err)
        }
        else{
            res.json({message:"Post deleted successfully",result})
        }
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/deletecomment',requestLogin,(req,res)=>{
    const {commentId,postId}=req.body
    Post.findByIdAndUpdate(postId,
    {
        $pull:{comments:{_id:commentId}}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        {
            return res.status(422).json({error:err})
        }
        console.log(result)
        return res.json({result})
    })
})


module.exports = router