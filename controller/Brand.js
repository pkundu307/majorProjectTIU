const { Brand } = require("../models/Brand");

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
    console.log(brands)
    res.json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrands = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    
    res.status(200).json(doc);
  } catch (err) {
    console.error(err)
    res.status(400).json(err);
  }
};
