const mongoose = require('mongoose')
const {Schema}=mongoose;

const productSchema= new Schema({
title:{type:String,required:true,unique:true},
description:{type:String,required:true},
price:{type:Number ,min :[1,'wrong input'],max:[100000,'wrong input']},
discountPercentage:{type:Number,min :[1,'wrong input'],max:[100000,'wrong input']},
rating:{type:Number,min :[0,'wrong input'],max:[5,'wrong input'],default:0},
stock:{type:Number,min :[0,'wrong input'],default:0},
brand:{type:String,required:true},
category:{type:String,required:true},
thumbnail:{type:String,required:true},
images:{type:[String],required:true},
deleted:{type:Boolean,default:false}

})
const virtual = productSchema.virtual('id')

virtual.get(function(){
    return this.id
})

productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){
        delete ret.id
    }
})


exports.Product = mongoose.model('Product',productSchema)