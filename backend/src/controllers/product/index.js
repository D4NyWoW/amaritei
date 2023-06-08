import Product from "../../models/product";
import Boom from "boom";
import ProductSchema from "./validations";

const Create = async (req, res, next) => {
  const input = req.body;
  const { error } = ProductSchema.validate(input);

  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  try {
    input.photos = JSON.parse(input.photos);

    const product = new Product(input);
    const savedData = await product.save();

    res.json(savedData);
  } catch (e) {
    next(e);
  }
};

const Get = async (req, res, next) => {
  const { product_id } = req.params;

  if (!product_id) {
    return next(Boom.badRequest("Missing paramater (:product_id)"));
  }

  try {
    const product = await Product.findById(product_id);

    res.json(product);
  } catch (e) {
    next(e);
  }
};

const Update = async (req, res, next) => {
  const { product_id } = req.params;

  try {
    const updated = await Product.findByIdAndUpdate(product_id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { product_id } = req.params;

  try {
    const deleted = await Product.findByIdAndDelete(product_id);

    if (!deleted) {
      throw Boom.badRequest("Product not found.");
    }

    res.json(deleted);
  } catch (e) {
    next(e);
  }
};

const limit = 12;
const GetList = async (req, res, next) => {
  let { page, category } = req.query;

  if (page < 1) {
    page = 1;
  }
  console.log(category);
  const skip = (parseInt(page) - 1) * limit;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  try {
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    console.log(products);
    res.json(products);
  } catch (e) {
    next(e);
  }
};

export default {
  Create,
  Get,
  Update,
  Delete,
  GetList,
};
