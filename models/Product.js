// "id": 1,
//       "title": "iPhone 9",
//       "description": "An apple mobile which is nothing like apple",
//       "price": 993,
//       "discountPercentage": 12.96,
//       "rating": 0,
//       "stock": 0,
//       "brand": "Apple",
//       "category": "smartphones",
//       "thumbnail": "https://trak.in/wp-content/uploads/2020/04/EUc0FJPXsAAnID0-1-1024x576.jpeg",
//       "images": [
//         "https://i.pinimg.com/originals/cf/93/62/cf936218168ddefdef5efab6562c748c.png",
//         "https://i.pinimg.com/originals/cf/93/62/cf936218168ddefdef5efab6562c748c.png",
//         "https://i.pinimg.com/originals/cf/93/62/cf936218168ddefdef5efab6562c748c.png",
//         "https://i.pinimg.com/originals/cf/93/62/cf936218168ddefdef5efab6562c748c.png"
//       ],
//       "deleted": true

const mongoose = require('mongoose')
const {Schema}=mongoose;

const productSchema= new Schema({
title:{type:String,required:true,unique:true},
description:{type:String,required:true},
price:{type:Decimal ,min :[1,'wrong input'],max:[100000,'wrong input']},
discountPercentage:{type:Decimal,min :[1,'wrong input'],max:[100000,'wrong input']},
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