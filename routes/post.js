const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const requireLogin = require("../middleware/requireLogin") ;
const Post = mongoose.model("Post")

router.get("/allpost" , requireLogin ,(req,res) => {
    Post.find()
    .populate("postedBy" , "_id name location")
    .then(posts => {
        res.json({posts:posts})
    })
    .catch(err => {
        console.log(err);
    })
})



router.post("/createpost" , requireLogin , (req ,res) => {
    const {title , location , body , pic} = req.body
    if(!title || !location || !body || !pic){
        return res.status(422).json({error : "Please add all the fields"})
    }
    
    req.user.password = undefined ;
    const post = new Post({
        title,
        body,
        location,
        photo : pic,
        postedBy : req.user
    })
    post.save().then(result => {
        res.json({post : result})
    })
    .catch(err => {
        console.log(err);
    })
})  

router.get("/mypost" , requireLogin , (req, res) => {
    Post.find({postedBy:req.user._id})
    .then(mypost =>{
        res.json({mypost : mypost})
    })
    .catch(err => {
        console.log(err);
    })
})

module.exports = router