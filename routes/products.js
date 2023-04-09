require("express-async-errors");
const express = require("express");
const { required } = require("joi");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

const { Product, Comment,validateProduct } = require("../models/product");

router.get("/", async (req, res,next) => {

  const prdocut = await Product.find()
    .populate("category", "name -_id")
    // .populate({
    //   path: "comments",
    //   populate: { path: "user" },
    // })  
    .select("-isActive ");
  res.send(prdocut);
});

router.post("/",[auth,isAdmin], async (req, res) => {
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    isActive: req.body.isActive,
    category: req.body.category,
    comments: req.body.comments,
  });
  try {
    const result = await product.save();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});


router.put("/comment/:id", auth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }
  

  const comments = new Comment({
    text: req.body.text,
    userName: req.body.userName ,
  });
  try {
    product.comments.push(comments);
    const updatedProduct=await product.save();
    res.send(updatedProduct)
  } catch (error) {
    console.log(error);
  }
});

router.delete("/comment/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }
  const comments=product.comments.id(req.body.commentid);
  comments.remove();

  const updatedProduct=await product.save();
  res.send(updatedProduct) 
});
router.put("/:id",auth, async (req, res) => {


  const id = req.params.id;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(result.error.details[0].message);
  }
  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.imageUrl = req.body.imageUrl;
  product.isActive = req.body.isActive;
  product.comments = req.body.comments;
  const updatedProduct = await product.save();
  res.send(updatedProduct);
});

router.delete("/:id",auth, async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }

  //   const index = products.indexOf(product);
  //   products.splice(index, 1);
  res.send(id + " id numaralı kayıt silinmiştir");
});

router.get("/:id",auth, async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id) .populate("category", "name -_id");

  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }
  res.send(product);
});

module.exports = router;
