const express = require("express");
const router = express.Router();
const { User, validateRegister,validateLogin  } = require("../models/user");
const bcrypt=require("bcrypt");
var jwt = require('jsonwebtoken');

router.get("/",async (req,res)=>{
    const user= await User.find()
    res.send(user);
})

router.post("/create", async (req, res) => {
    const { error } = validateRegister(req.body);
  
    if (error) {
      return res.status(400).send(result.error.details[0].message);
    }
    
    let user=await User.findOne({email:req.body.email});
    if (user) {
        return res.status(400).send("bu email ile daha önce kayıt yapılmıs ");
    }
    
     user = new User({
    
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password,10)
     
    });
    try {
       
         await user.save();
         var token = user.createAutoToken();//bize jwt olusturacak ınctence 
         res.header("x-auto-token",token).send(user);
      
    } catch (error) {
      console.log(error);
    }
  });


  router.post("/auth", async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send(result.error.details[0].message);
    }
    let user=await User.findOne({email:req.body.email});
    if (!user) {
        return res.status(400).send("hatalı email");
    }
    
        
    const isSuccess=await bcrypt.compare(req.body.password,user.password)
    if (!isSuccess) {
        return res.status(400).send("hatalı parola");
    }
    var token = user.createAutoToken();//bize jwt olusturacak ınctence
    res.header("x-auto-token",token).send(user);
  });
  module.exports=router