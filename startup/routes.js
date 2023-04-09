const express = require("express");
const products = require("../routes/products");
const categories = require("../routes/categories");
const user = require("../routes/users");
const home = require("../routes/home");
const error = require("../middleware/error");


module.exports=function(app){
    app.use(express.json());
app.use("/api/products", products);
app.use("/api/categories", categories);
app.use("/api/user/", user);
app.use("/", home);
app.use(error)
}