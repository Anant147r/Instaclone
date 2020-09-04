const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const User=mongoose.model("User");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {JWT_SECRET}=require("../keys")
const requireLogin=require("../middleware/requireLogin")

router.get("/protected",requireLogin,(req,res)=>{
    res.end("Hello user");
})

router.post("/signup",(req,res)=>{
    //console.log(req.body);
    const {name,email,password}=req.body;
    if(!name || !email || !password)
    {
        return res.status(422).json({error:"Please add all the fields"});
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12).
        then(hashpassword=>{
            const user =new User({
                email,
                password:hashpassword,
                name
            }) 
            user.save().then(user=>{
                res.json({message:"saved successfully"})
            }).catch(err=>{console.log(err)})
        })
    }).catch(err=>{console.log(err)})
})

router.post("/signin",(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password)
    {
        return res.status(422).json({error:"fields not filled completely"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Incorrect Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email}=savedUser;
                res.json({token,user:{_id,name,email}});
            }
            else{
                return res.status(422).json({error:"Incorrect Email or Password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})

module.exports=router;