const { Product } = require("../model/Product");
const { User } = require("../model/User");
const {Cart} = require("../model/Cart")
const nodemailer = require('nodemailer');
 

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  // TODO : we have to try with multiple category and brands after change in front-end
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  //TODO : How to get sort on discounted Price not on Actual price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if stock is being updated and is greater than 0
    const stockChanged = 'stock' in updatedData && updatedData.stock > 0 && updatedData.stock !== product.stock;

    // Update the product
    Object.assign(product, updatedData);
    const updatedProduct = await product.save();

    if (stockChanged) {
      try {
        const userIds = product.userIdsFN;
        const userIdsForAssign = product.userIdsFA;
        const users = await User.find({ _id: { $in: userIds } });
        const userForCart = await  User.find({ _id: { $in: userIdsForAssign } });
        const userIdsForCart = userForCart.map(user => user._id)
        const emails = users.map(user => user.email);
        console.log(emails);
        console.log(userIdsForCart,'fa');

        if (emails.length > 0) {
        //   // Configure nodemailer
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "pkundu307@gmail.com",
              pass: "wvco qefp awgh gbrj",
            },
          });
          const timestamp = new Date().toLocaleString();

          let mailOptions = {
            from: "pkundu307@gmail.com",
            to: emails,
            subject: 'Product Back in Stock',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
                <h2 style="text-align: center; color: #4CAF50;">Good News!</h2>
                <p>Dear Customer,</p>
                <p>We are excited to inform you that the product <strong>${product.title}</strong> is back in stock.</p>
                <p>Don't miss out! Click the link below to purchase it now:</p>
                <a href="https://major-project-tiu.vercel.app" style="display: inline-block; padding: 10px 20px; color: white; background-color: #4CAF50; border-radius: 5px; text-decoration: none;">Buy Now</a>
                <p style="margin-top: 20px;">Thank you for shopping with us!</p>
                <p>Best regards,<br>E-Commerce Team</p>
                <hr>
                <p style="font-size: 0.9em; color: #888;">Sent on: ${timestamp}</p>
              </div>
            </div>
          `,
          text: `The product ${product.title} is back in stock. Visit https://major-project-tiu.vercel.app to purchase it now. Sent on: ${timestamp}`
          };

          
          await transporter.sendMail(mailOptions);
          res.status(200).json("mail sent");

          // Clear userIdsFN
          product.userIdsFN = [];
          await product.save();
        }
        if(userIdsForCart.length>0){
          for (let index = 0; index < userIdsForCart.length; index++) {
            const cart = new Cart({quantity:1,user:userIdsForCart[index],product:product._id});            
            await cart.save();
            const user=User.findById(userForCart(index))
            console.log(user);
            console.log("added to cart");


            
          }
          product.userIdsFA = [];

          await product.save();

        }
      } catch (emailError) {
        console.error('Error sending notification emails:', emailError);
      }
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json(err);
  }
};

exports.notifyUser = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const product = await Product.findById(productId);
    const user = await User.findById(userId);
    const mail = user.email;
    if (!product.userIdsFN.includes(userId)) {
      product.userIdsFN.push(userId);
      await product.save();
    }

    res.json({ email: mail, productTitle: product.title });
  } catch (err) {
    console.log(err);
  }
};

exports.assignUser = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const product = await Product.findById(productId);
    const user = await User.findById(userId);
    const mail = user.email;
    if (!product.userIdsFA.includes(userId)) {
      product.userIdsFA.push(userId);
      await product.save();
    }

    res.json({ email: mail, productTitle: product.title });
  } catch (err) {
    console.log(err);
  }
};

