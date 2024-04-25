const express = require('express')

const {fetchBrands,createBrands}= require('../controller/Brand')

const router = express.Router()

router.get('/getall',fetchBrands)
router.post('/',createBrands);

exports.router =router