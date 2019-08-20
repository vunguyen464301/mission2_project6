var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Order = require('../models/order');
var Product = require('../models/product');
var jwt= require('jsonwebtoken');
const config = require('../config');
//set time code_jwt 5m
var CODE_TOKEN = "";

router.get('/cartpage', isLoggedIn, (req, res, next) => {
  Order.find({}).exec((err,task)=>{
    if (err) res.status(400).send('err');
    else{
      res.render('user/cartpage',{data:task});
    }
  });
});

router.get('/cartpage/:_id', isLoggedIn, (req, res, next) => {
  let id_product = req.params._id;
  // console.log(id_product[0]+','+id_product[1])
  if(id_product[0]==="R" && id_product[1]==="_"){
    let id_Bill="";
    for(let i=2;i<id_product.length;i++){
      id_Bill=id_Bill+id_product[i];
    }
    Order.findByIdAndRemove({
      _id:id_Bill
    }).exec((err,task)=>{
      if (err) res.status(400).send('err');
      else {
          res.redirect('/user/cartpage');
      }
    })

  }else{
    Product.findOne({
      _id:id_product
    }).exec((err,task)=>{
      if(err) res.status(400).send('err');
      else{
        var newOrder= new Order();
        newOrder.id_product=task._id;
        newOrder.imagePath=task.imagePath;
        newOrder.title=task.title;
        newOrder.price=task.price;
        newOrder.time= to_time();
        newOrder.save((err,task)=>{
          if(err) res.status(400).send('err');
          else{
            res.render('user/cartpage');
          }
        });
      }
    });
  }
});


router.get('/signout', (req, res, next) => {
  CODE_TOKEN="";
    res.redirect('/');
});

router.get('/signup',function(req,res,next){
  res.render('user/signup');
});

router.post('/signup',(req,res,next)=>{
  if( req.body.email.length==0 || req.body.password.length==0){
    res.render('user/signup',{message:'Please input email or password !'});
  }
  else{
    User.findOne({'email':req.body.email},(err,user)=>{
      // if(err){
      //     return done(err);
      // }
      if(user){
          res.render('user/signup',{message:'Email is already in use !'});
      }else{
          var newUser = new User();
          newUser.email= req.body.email;
          newUser.password=newUser.encrpytPassword(req.body.password);
          newUser.save((err,task)=>{
              if(err){
                res.render('user/signup',{message:err});
              }
              res.redirect('/user/cartpage');
          });
      }
  });
  }
});


router.get('/signin',function(req,res,next){
  res.render('user/signin');
});

router.post('/signin',(req,res,next)=>{
  if( req.body.email.length==0 || req.body.password.length==0){
    res.render('user/signin',{message:'Please input email or password !'});
  }
  else{
    User.findOne({'email':req.body.email},(err,user)=>{
      if(user){
        if(!user.validPassword(req.body.password)){
          res.render('user/signin',{message:'Password is wrong !'});
        }else{
          var token =jwt.sign({
            email:user.email,
            userID:user._id
          },config.secret,{algorithm:'HS256',expiresIn:config.tokenLife});
          CODE_TOKEN=token;
        console.log(CODE_TOKEN)
          res.redirect('/user/cartpage'); 
        }
      }else{
          res.render('user/signin',{message:'Email is already in use !'});
      }
  })
  }
});


function isLoggedIn(req, res, next) {
  console.log(CODE_TOKEN)
    var token = CODE_TOKEN;
    // decode token
    if (token.length!=0) {
    jwt.verify(token,config.secret,(err,decode)=>{
        if(err){
          CODE_TOKEN="";
          res.redirect('/user/signin');
        }else{
            return next();
        }
    });
    } else {
      res.redirect('/user/signin');
    }
}

to_time = () =>{
  let time = new Date();
  let h = time.getHours();
  let m =time.getMinutes();
  let date=time.getDate();
  let month=time.getMonth()+1;
  let years=time.getFullYear();
  let time_curent=date+"/"+month+"/"+years+"_"+h+":"+m;
  return time_curent;
}
module.exports = router;
