const Joi = require("joi");
const Response = require("./Response");
const Helper = require("./Helper");

const AddressValidation = {
  /**
   * @description "Validate create address request"
   * @param req
   * @param res
   * @param callback
   */
  createAddressValidation: (req, res, callback) => {
    const schema = Joi.object({
      label: Joi.string().trim().max(50).valid("Home", "Work", "Other").optional(),
      addressLine1: Joi.string().trim().max(200).required(),
      addressLine2: Joi.string().trim().max(200).optional(),
      city: Joi.string().trim().max(100).required(),
      state: Joi.string().trim().max(100).required(),
      postalCode: Joi.string().trim().max(20).required(),
      country: Joi.string().trim().max(100).required(),
      phone: Joi.string().trim().max(20).optional(),
      isDefault: Joi.boolean().optional()
    });
    
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("createAddressValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description "Validate update address request"
   * @param req
   * @param res
   * @param callback
   */
  updateAddressValidation: (req, res, callback) => {
    const schema = Joi.object({
      label: Joi.string().trim().max(50).valid("Home", "Work", "Other").optional(),
      addressLine1: Joi.string().trim().max(200).optional(),
      addressLine2: Joi.string().trim().max(200).optional(),
      city: Joi.string().trim().max(100).optional(),
      state: Joi.string().trim().max(100).optional(),
      postalCode: Joi.string().trim().max(20).optional(),
      country: Joi.string().trim().max(100).optional(),
      phone: Joi.string().trim().max(20).optional(),
      isDefault: Joi.boolean().optional()
    });
    
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updateAddressValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description "Validate address ID parameter"
   * @param req
   * @param res
   * @param callback
   */
  addressIdValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required()
    });
    
    const { error } = schema.validate(req.params);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("addressIdValidation", error))
      );
    }
    return callback(true);
  }
};

module.exports = AddressValidation; 