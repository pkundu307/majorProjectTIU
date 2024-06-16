const { Cart } = require('../model/Cart');
const { User } = require('../model/User');
const nodemailer = require("nodemailer");

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate('product');

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  const {id} = req.user;
  const cart = new Cart({...req.body,user:id});
  try {
    const doc = await cart.save();
    const result = await doc.populate('product');
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.notifyMe=async(req,res)=>{
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    const mail=user.email;

  const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "pkundu307@gmail.com",
        pass: "ysmo vspe fxqx lipx",
      },
    });

    const currentDateTime = new Date().toLocaleString();

    // Create the email options
    const mailOptions = {
      from: "pkundu307@gmail.com",
      to: email,
      subject: "Notification for product in stock",
      text: ``,
      html: `
      
      <div style="background-color: #696ef0; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif;">
      <h1 style="color: #fff;">Zauvijek</h1>
      <h2 style="color: #333;">Notification for product in stock</h2>
    <p style="color: #fff;">Hello,</p>
    <p style="color: #fff;">You requested to get notification when product in stock:</p>
    <p style="background-color: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 16px; color: #444; margin: 0;">
        ${currentDateTime}
    </p>
    <p style="color: #fff; margin-top: 20px;">Your product in in stock</p>
    <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 10px;">
        <p style="font-size: 20px; color: #444; margin: 0; text-align: center;">${resetToken}</p>
    </div>
    <p style="color: #334; font-size: 12px; margin-top: 20px;">If you did not purchase this product ,We will assign this product for someone else <span style="color: #fff;"><u><i>support@zauvijek.in</i></u></span></p>
</div>

      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });

  } catch (err) {
    res.status(400).json(err);
  }
}

exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate('product');

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
