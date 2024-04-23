const {Category} =require('../models/Category')

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exac();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategories = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
