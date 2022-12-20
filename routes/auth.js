const express = require("express");
const router = express.Router();


const mongoose = require("mongoose")
const User = mongoose.model("User")

const bcrypt = require("bcryptjs")
const jwt  = require("jsonwebtoken")
require("dotenv").config()

const requireLogin = require("../middleware/requireLogin")

router.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User is already exists with that email" });
            }

            bcrypt.hash(password, 12).then(hashedpassword => {

                const user = new User({
                    email,
                    password : hashedpassword,
                    name
                })
                user.save()
                    .then(user => {
                        res.json({ message: "saved Successfully" })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        }).catch(err => {
            console.log(err);
        })
})

router.post("/signin" , (req , res) => {
    const {email , password} = req.body
    if(!email || !password){
       return res.status(422).json({error : "please add email or password"})
    }
    User.findOne({email : email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error : "Invalid Email or Password"})
        }
        bcrypt.compare(password , savedUser.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id : savedUser._id} , process.env.JWT_SECRET)
                const {_id , name, email } =savedUser
                res.json({token : token , user : {_id , name, email }})
            }
            else{
                return res.status(422).json({error : "Invalid Email or Password"})
            }
        }).catch(err => {
            console.log(err);
        })
    })
})

module.exports = router