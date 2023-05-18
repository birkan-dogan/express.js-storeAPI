const Product = require("../models/productsModel");

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

  // /api/v1/products?sort=rating&limit=5&page=4
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ status: "success", size: products.length, products });
};

module.exports = { getAllProducts };
