const Product = require("../models/productsModel");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ status: "success", size: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query; // that's our logic.
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
    // https://www.mongodb.com/docs/manual/reference/operator/query/regex/#x-and-s-options
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const products = await result;

  res.status(200).json({ status: "success", size: products.length, products });
};

module.exports = { getAllProducts, getAllProductsStatic };
