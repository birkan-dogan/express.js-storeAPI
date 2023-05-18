const express = require("express");

const router = express.Router();

const { getAllProducts, companyGroup, topThree, simplePipeline, createProduct } = require("../controllers/productsController");

router.route("/").get(getAllProducts).post(createProduct);

router.route("/companies").get(companyGroup);
router.route("/top-3").get(topThree);

module.exports = router;
