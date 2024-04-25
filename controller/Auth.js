const { User } = require('../models/User')


exports.createUser = async (req, res) => {
  const user = new User({ email: req.body.email, password: req.body.password });
  try {
    const doc = await user.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    console.log({ user });
    if(!user){
      res.status(401).json({message:'no such email'})
    }else if(user.password === req.body.password){
      res.status(200).json({id:user.id,email:user.email,name:user.name,role:user.role})
    }else{
      res.status(401).json({message:'wrong password'})
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
