const { Brand } = require("../models/Brand");

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exac();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrands = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};
