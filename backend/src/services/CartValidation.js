const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");

module.exports = {
  addToCartValidation: (req, res, callback) => {
    const schema = Joi.object({
      productId: Joi.string().trim().required(),
      quantity: Joi.number().integer().min(1).default(1),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("addToCartValidation", error))
      );
    }
    return callback(true);
  },

  updateQuantityValidation: (req, res, callback) => {
    const schema = Joi.object({
      quantity: Joi.number().integer().min(1).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updateQuantityValidation", error))
      );
    }
    return callback(true);
  },

  removeFromCartValidation: (req, res, callback) => {
    const schema = Joi.object({
      productId: Joi.string().trim().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("removeFromCartValidation", error))
      );
    }
    return callback(true);
  },
}; 