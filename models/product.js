const { date } = require("joi");
const Joi = require("joi");
const  mongoose = require("mongoose");

const commentSchema=mongoose.Schema({
  text:String,
  userName:String,
  date:{
    type:Date,
    default:Date.now()
  },
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
})

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    date: {
      type: Date,
      default: Date.now(),
    },
    isActive: Boolean,
    category:{type:mongoose.Schema.Types.ObjectId,ref:"Category"},//kategorinin idisi tutuyor
    comments:[commentSchema]
  });
  function validateProduct(product) {
    const schema = new Joi.object({
      name: Joi.string().min(3).max(30).required(),
      price: Joi.number().required(),
      description:Joi.required(),
      imageUrl:Joi.required(),
      isActive: Joi.required(),
      category:Joi.string(),
      comments:Joi.array()

  
    });
  
    return schema.validate(product);
  }
  const Product=mongoose.model("Product", productSchema); //model
  const Comment=mongoose.model("Comment", commentSchema); //model
  module.exports = {Product,Comment,validateProduct}