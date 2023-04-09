const express = require("express");
const router = express.Router();
const { Category, validateCategory } = require("../models/category");

router.get("/",async (req,res)=>{
    const categories= await Category.find().populate("products","name price -_id");
    res.send(categories);
})

router.post("/", async (req, res) => {
    const { error } = validateCategory(req.body);
  
    if (error) {
      return res.status(400).send(result.error.details[0].message);
    }
  
    const category = new Category({
      name: req.body.name,
      products:req.body.products
    });
    try {
      const result = await category.save();
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  });
router.put("/:id",async(req,res)=>{
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).send("aradığınız kategori bulunamadı.");
  }
  const { error } = validateCategory(req.body);

  if (error) {
    return res.status(400).send(result.error.details[0].message);
  }
  category.name=req.body.name
  const updatedCategory=await category.save();
  res.send(updatedCategory)

})

router.delete("/:id",async(req,res)=>{
    const category=await Category.findByIdAndDelete(req.params.id);
    res.send(category.name+"silinmiştir")
})
module.exports=router

