var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    id_product:{type:String,required:true},
    imagePath:{type:String,required:true},
    title:{type:String,required:true},
    price:{type:String,required:true},
    time:{type:String,required:true}
});

module.exports= mongoose.model('Order',schema); 