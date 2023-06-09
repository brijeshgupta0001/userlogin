//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

const mongoose = require("mongoose");

const encrypt = require("mongoose-encryption");
console.log(process.env.API_KEY);
mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.then(()=>{
    console.log("successfully connected");
})
.catch((error)=>{
    console.log(error.message);
});


const userSchema = new mongoose.Schema({
    email : String,
    password : String

});

userSchema.plugin(encrypt,{secret :process.env.SECRET ,encryptedFields :["password"]});

const User = new mongoose.model("User",userSchema);



app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({
    extended :true
}));


app.get("/",(req,res)=>{
    res.render("home");
}); 

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
 const newUser = new User({
    email : req.body.username,
    password : req.body.password
 });
 newUser.save()
 try{
    res.render("secrets");
 }
 catch(error){
    console.log(error.message);
 }
})

app.post("/login",function(req,res){
const email = req.body.username;
const password = req.body.password;
User.findOne({email : email})
.then((users)=>{
    if(password === users.password){
        res.render("secrets");
    }
    else{
      res.send("First You have to register !");  
    }
})
.catch((error)=>{
    console.log(error);
});
});





app.listen(3000,function(){
    console.log("Server is running on port 3000");
})