const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors')
const brandsRouter = require('./routes/Brands')
const productsRouter = require('./routes/Products')
const categoriesRouter =require('./routes/Categories')


const server = express()

server.use(cors({
exposedHeaders:['X-Total-Count']
}))
server.use(express.json())
server.use('/brands',brandsRouter.router)
server.use('./products',productsRouter.router)
server.use('./categories',categoriesRouter.router)


main().catch(err=>console.log(err))


async function main(){
    await mongoose.connect('mongodb://localhost:27017/ecommerrce');
    console.log('database connected');
}

server.get('/',(req,res)=>{
    res.json({staus:'success'})
})

server.listen(8080,()=>{
    console.log('server is running');
})