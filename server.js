const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors')
const brandsRouter = require('./routes/Brands')


const server = express()

server.use(cors({

}))
server.use(express.json())
server.use('/brands',brandsRouter.router)

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