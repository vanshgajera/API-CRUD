const express = require('express');

const port = 9000;

const app = express();

const db = require('./config/mongoose');

const model = require('./models/RegisterModel');

const passport = require('passport');

const jwtData = require('jsonwebtoken');

const passportJwt = require('./config/passport-jwt-strategy');

const session = require('express-session');

app.use(session({
    secret: "raj",
    saveUninitialized:true,
    cookie: { maxAge: 1000*60*60 },
    resave: false 
}));

app.use(express.urlencoded());

app.post('/registerdata',async(req,res)=>{
    try{
        let register = await model.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        });
        if(register){
            return res.json({"status" : "1","msg":"user successfully create"});
        }else{
            return res.json({"status" : "0","msg":"user not successfully create"});
        }
    }catch(err){
        console.log(err);
        return false;
    }
})

app.post('/logindata',async(req,res)=>{
    try{
        let email = req.body.email;
        let user = await model.findOne({email : email});
        if(!user || user.password != req.body.password){
            return res.json({"status" : "0","msg":"user and password not metch"});
        }

        let token = jwtData.sign(user.toJSON(),"RNW",{expiresIn : 1000*60*60});
        return res.json({"status" : "1","token":token});
    }catch(err){
        console.log(err); 
        return false;
    }
})


app.get('/view',passport.authenticate('jwt', { session: false }),async(req,res)=>{
    try{
        let viewrecord = await model.find({});
        if(viewrecord){
            return res.json({"status":"1","msg" : viewrecord});
        }else{
            return res.json({"status":"0","msg" : "record not fetch"});
        }
    }catch(err){
        console.log(err);
        return false;
    }
})

app.put('/editdata',async (req,res)=>{
    try{
        let id = req.body.id;
        let userid = await model.findByIdAndUpdate(id,{
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
        })
        if(userid){
            return res.json({"status":"1","msg":"user update"});
        }else{
            return res.json({"status":"0","msg":"user not update"});
        }
    }catch(err){
        return res.json({"status":"0","msg":err});
    }
})

app.listen(port,(err)=>{
    if(err){
        console.log(err);
        return false;
    }
    console.log("server is start on port :- "+port); 
})