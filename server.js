const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors')
const brandsRouter = require('./routes/Brands')
const productsRouter = require('./routes/Products')
const categoriesRouter =require('./routes/Categories')
const authRouter= require('./routes/Auth')
// const bodyParser = require('body-parser');
// const cors = require('cors');


const server = express()
    mongoose.connect('mongodb://localhost:27017/ecommerrce', {
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
server.use(cors({
exposedHeaders:['X-Total-Count']
}))
server.use(express.json())
server.use('/brands',brandsRouter.router)
server.use('/products',productsRouter.router)
server.use('/categories',categoriesRouter.router)
server.use('/auth',authRouter.router)
// server.use(bodyParser.json());
// server.use(cors());

// main().catch(err=>console.log(err))



// async function main(){

// }

server.get('/',(req,res)=>{
    res.json({status:'success'})
})

server.listen(8080,()=>{
    console.log('server is running');
})