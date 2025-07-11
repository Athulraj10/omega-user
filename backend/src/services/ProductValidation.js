const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");

module.exports = {
  getProductByIdValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getProductByIdValidation", error))
      );
    }
    return callback(true);
  },

  getProductBySlugValidation: (req, res, callback) => {
    const schema = Joi.object({
      slug: Joi.string().trim().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getProductBySlugValidation", error))
      );
    }
    return callback(true);
  },

  searchProductValidation: (req, res, callback) => {
    const schema = Joi.object({
      q: Joi.string().trim().min(1).required(),
      limit: Joi.number().integer().min(1).max(100).default(10),
      page: Joi.number().integer().min(1).default(1),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("searchProductValidation", error))
      );
    }
    return callback(true);
  },

  listProductValidation: (req, res, callback) => {
    const schema = Joi.object({
      category: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
      brand: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
      minPrice: Joi.number().positive().optional(),
      maxPrice: Joi.number().positive().optional(),
      sort: Joi.string().valid("price_asc", "price_desc", "newest", "oldest", "rating", "popular").optional(),
      search: Joi.string().trim().optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      colors: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
      sizes: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
      tags: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
      isFeatured: Joi.boolean().optional(),
      isBundle: Joi.boolean().optional(),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("listProductValidation", error))
      );
    }
    return callback(true);
  },

  getProductReviewsValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      sort: Joi.string().valid("newest", "highest", "lowest").default("newest"),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(50).default(10),
    });
    const { error } = schema.validate({ ...req.params, ...req.query });
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getProductReviewsValidation", error))
      );
    }
    return callback(true);
  },

  checkAvailabilityValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      variantId: Joi.string().trim().optional(),
    });
    const { error } = schema.validate({ ...req.params, ...req.query });
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("checkAvailabilityValidation", error))
      );
    }
    return callback(true);
  },

  getSimilarProductsValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      limit: Joi.number().integer().min(1).max(20).default(8),
    });
    const { error } = schema.validate({ ...req.params, ...req.query });
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getSimilarProductsValidation", error))
      );
    }
    return callback(true);
  },

  getRelatedProductsValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      limit: Joi.number().integer().min(1).max(20).default(8),
    });
    const { error } = schema.validate({ ...req.params, ...req.query });
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getRelatedProductsValidation", error))
      );
    }
    return callback(true);
  },

  getFeaturedValidation: (req, res, callback) => {
    const schema = Joi.object({
      limit: Joi.number().integer().min(1).max(50).default(8),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getFeaturedValidation", error))
      );
    }
    return callback(true);
  },

  getBestsellersValidation: (req, res, callback) => {
    const schema = Joi.object({
      limit: Joi.number().integer().min(1).max(50).default(8),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getBestsellersValidation", error))
      );
    }
    return callback(true);
  },

  getNewArrivalsValidation: (req, res, callback) => {
    const schema = Joi.object({
      limit: Joi.number().integer().min(1).max(50).default(8),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getNewArrivalsValidation", error))
      );
    }
    return callback(true);
  },

  getDealsValidation: (req, res, callback) => {
    const schema = Joi.object({
      limit: Joi.number().integer().min(1).max(50).default(8),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getDealsValidation", error))
      );
    }
    return callback(true);
  },

  getTrendingValidation: (req, res, callback) => {
    const schema = Joi.object({
      limit: Joi.number().integer().min(1).max(50).default(8),
    });
    const { error } = schema.validate(req.query);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getTrendingValidation", error))
      );
    }
    return callback(true);
  },

  getVariantsValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getVariantsValidation", error))
      );
    }
    return callback(true);
  },

  getCompareDataValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getCompareDataValidation", error))
      );
    }
    return callback(true);
  },
}; 