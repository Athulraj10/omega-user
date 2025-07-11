const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");

module.exports = {
  uploadProfilePicValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      userName: Joi.string().trim().min(2).max(100).optional(),
      image: Joi.string().trim().optional(),
      fee: Joi.number().integer().min(0).default(0),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("uploadProfilePicValidation", error))
      );
    }
    return callback(true);
  },

  editProfileValidation: (req, res, callback) => {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(2).max(100).optional(),
      lastName: Joi.string().trim().min(2).max(100).optional(),
      image: Joi.string().trim().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("editProfileValidation", error))
      );
    }
    return callback(true);
  },
}; 