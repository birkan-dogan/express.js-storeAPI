const Product = require("../models/productsModel");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ status: "success", size: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  const products = await Product.find(queryObject);
  res.status(200).json({ status: "success", size: products.length, products });
};

module.exports = { getAllProducts, getAllProductsStatic };
