const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");

module.exports = {
  addToWishlistValidation: (req, res, callback) => {
    const schema = Joi.object({
      productId: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("addToWishlistValidation", error))
      );
    }
    return callback(true);
  },

  removeFromWishlistValidation: (req, res, callback) => {
    const schema = Joi.object({
      productId: Joi.string().trim().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("removeFromWishlistValidation", error))
      );
    }
    return callback(true);
  },

  checkWishlistStatusValidation: (req, res, callback) => {
    const schema = Joi.object({
      productId: Joi.string().trim().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("checkWishlistStatusValidation", error))
      );
    }
    return callback(true);
  },
}; 