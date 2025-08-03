const Joi = require("joi");
const Response = require("./Response");
const Helper = require("./Helper");

const AddressValidation = {
  createAddressValidation: (req, res, callback) => {
    const schema = Joi.object({
      label: Joi.string().trim().max(50).valid("Home", "Work", "Other").optional(),
      address: Joi.string().trim().max(200).required(),
      country: Joi.string().trim().max(100).required(),
      countryName: Joi.string().trim().max(100).required(),
      firstName: Joi.string().trim().max(100).required(),
      lastName: Joi.string().trim().max(100).required(),
      mobileNo: Joi.string().trim().max(100).required(),
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error);
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
      address: Joi.string().trim().max(200).required(),
      country: Joi.string().trim().max(100).required(),
      countryName: Joi.string().trim().max(100).required(),
      firstName: Joi.string().trim().max(100).required(),
      lastName: Joi.string().trim().max(100).required(),
      mobileNo: Joi.string().trim().max(100).required(),
    });
    
    const { error } = schema.validate(req.body);
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