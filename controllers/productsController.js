const Product = require("../models/productsModel");

exports.getAllProducts = async (req, res) => {
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

exports.createProduct = async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: { newProduct },
  });
};

// aggregations

// We want to retrieve the average price and total count of products for each company.
exports.companyGroup = async (req, res) => {
  try {
    const pipeline = await Product.aggregate([
      {
        $group: {
          _id: "$company",
          averagePrice: { $avg: "$price" },
          totalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          totalCount: 1,
        },
      },
      {
        $sort: {
          averagePrice: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      result: pipeline.length,
      data: pipeline,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error });
  }
};

// Find the top 3 companies with the highest average rating for products that are featured
exports.topThree = async (req, res) => {
  try {
    const pipeline = await Product.aggregate([
      {
        $match: {
          featured: true,
        },
      },
      {
        $group: {
          _id: "$company",
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          averageRating: -1,
        },
      },
      {
        $limit: 3,
      },
    ]);

    res.status(200).json({ status: "success", data: pipeline });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error });
  }
};
