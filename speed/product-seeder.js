var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demo1');

var products = [
    new Product({
        imagePath: 'phone1.png',
        title: "Iphone XS Max 512GB",
        price: 1800
    }),
    new Product({
        imagePath: 'phone1.png',
        title: "Iphone XS Max 256GB",
        price: 1600
    }),
    new Product({
        imagePath: 'phone1.png',
        title: "Iphone XS Max 128GB",
        price: 1400
    }),
    new Product({
        imagePath: 'phone1.png',
        title: "Iphone XS Max 64GB",
        price: 1200
    })
]
var done=0;
for(let i = 0 ;i<products.length;i++){
    products[i].save(function(err,result){
        done++;
        if(done===products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}