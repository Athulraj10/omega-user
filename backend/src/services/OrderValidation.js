const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");

module.exports = {
  placeOrderValidation: (req, res, callback) => {
    const schema = Joi.object({
      items: Joi.array().items(
        Joi.object({
          productId: Joi.string().trim().required(),
          quantity: Joi.number().integer().min(1).required(),
          price: Joi.number().positive().required(),
        })
      ).min(1).required(),
      shippingAddress: Joi.object({
        label: Joi.string().trim().valid("Home", "Work", "Other").default("Home"),
        addressLine1: Joi.string().trim().max(200).required(),
        addressLine2: Joi.string().trim().max(200).optional(),
        city: Joi.string().trim().max(100).required(),
        state: Joi.string().trim().max(100).required(),
        postalCode: Joi.string().trim().max(20).required(),
        country: Joi.string().trim().max(100).required(),
        phone: Joi.string().trim().max(20).optional(),
      }).required(),
      totalAmount: Joi.number().positive().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("placeOrderValidation", error))
      );
    }
    return callback(true);
  },

  getOrderByIdValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getOrderByIdValidation", error))
      );
    }
    return callback(true);
  },

  cancelOrderValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("cancelOrderValidation", error))
      );
    }
    return callback(true);
  },
}; 