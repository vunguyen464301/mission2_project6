var express = require('express');
var router = express.Router();
var Product =require('../models/product');
var User = require('../models/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  //phương thức lấy dữ liệu từ API trực tiếp
  Product.find(function(err,data){
    res.render('shop/categorypage', { title: 'Shopping cart',products:data });
  });
});





module.exports = router;
