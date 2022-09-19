const Product = require("../model/Products");
const asyncErrorPattern = require("../middelware/asyncError");
const ErrorHander = require("../utile/errorhandler");
// return nxt(new ErrorHander("Product not added", 404));

const addProduct = asyncErrorPattern(async (req, res, nxt) => {
  await new Product(req.body).save();
  res.status(200).json({ msg: "Product added Successfully  " });
});
const deleteProduct = asyncErrorPattern(async (req, res, nxt) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id });
  if (!product) return nxt(new ErrorHander("Product not found", 400));
  res.status(200).json({ msg: "Product deleted " });
});
const updateProduct = asyncErrorPattern(async (req, res, nxt) => {
  const product = await Product.findOneAndUpdate(req.params.id, req.body, {
    returnOriginal: false,
  });
  if (!product) return nxt(new ErrorHander("Product not found", 400));
  res.status(200).json({ msg: "Product updated " });
});
const getProductById = asyncErrorPattern(async (req, res, nxt) => {
  const product = await Product.find({ _id: req.params.id });
  if (!product) return nxt(new ErrorHander("Product not found", 400));
  res.status(200).json({ msg: "success", product });
});
const getProducts = asyncErrorPattern(async (req, res, nxt) => {
  const products = await Product.find();
  if (!products) return nxt(new ErrorHander("Products not found", 400));
  res.status(200).json({ msg: "success", products });
});
const countProducts = (req, res, nxt) => {
  Product.count({}, function (err, count) {
    res.status(200).json({ count: count });
  });
};
const getProductsToHome = asyncErrorPattern(async (req, res) => {
  const sortByOrder = await Product.find({}).sort({ order: -1 }).limit(10);
  const newProducts = await Product.find({}).limit(10);
  const menProducts = await Product.find({ categories: "men" });
  const womenProducts = await Product.find({ categories: "women" });
  const kidsProducts = await Product.find({ categories: "kids" });
  res
    .status(200)
    .json({
      sortByOrder,
      newProducts,
      menProducts,
      womenProducts,
      kidsProducts,
    });
});
const getProductsByFilter = asyncErrorPattern(async (req, res, nxt) => {
  const { category, f, page } = req.query;
  var products;
  if (f === "bestsaler") {
    if (category === "all") {
      products = await Product.find()
        .sort({ order: -1 })
        .skip((parseInt(page) - 1) * 15)
        .limit(15);
    } else {
      products = await Product.find({ categories: category })
        .sort({ order: -1 })
        .skip((parseInt(page) - 1) * 15)
        .limit(15);
    }
  } else {
    if (category == "all") {
      products = await Product.find({})
        .skip((parseInt(page) - 1) * 15)
        .limit(15);
    } else {
      products = await Product.find({ categories: category })
        .skip((parseInt(page) - 1) * 15)
        .limit(15);
    }
  }
  res.status(200).json({ products });
});
const getProductBySearch = asyncErrorPattern(async (req, res, nxt) => {
  const products = await Product.find({ title: { $regex : req.body.search , $options: '$i'} }).exec()
  if(!products) return res.status(401).json({success:false})
  res.status(200).json({ products });
});

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
  getProductsToHome,
  getProductsByFilter,
  getProductBySearch,
};
