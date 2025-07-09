const bcrypt = require("bcrypt");
const moment = require("moment");
const Response = require("../../services/Response");
const { makeRandomNumber, AppName, userEmailVerification, resendOtp } = require("../../services/Helper");
const Mailer = require("../../services/Mailer");
const { userRegisterValidation, verifyEmailValidation, resendEmailValidation, userNameValidation, usersSameDeviceValidation, userDetailValidation } = require("../../services/UserValidation");
const { User, Otp, UserWallet } = require("../../models");
const { FAIL, DELETE, INACTIVE, SUCCESS, INTERNAL_SERVER, ACTIVE, USER_MODEL, USER_WALLET } = require("../../services/Constants");

module.exports = {
  /**
   * @description "This function is for User-Registration."
   * @param req
   * @param res
   */
  userRegistration: async (req, res) => {
    try {
      const requestParams = req.body;
      // Below function will validate all the fields which we were passing from the body.
      userRegisterValidation(requestParams, res, async (validate) => {
        if (validate) {
          let checkEmailExist = await User.countDocuments({
            email: requestParams.email
          });
          // console.log({checkEmailExist})
          if (checkEmailExist !== 0) {
            return Response.errorResponseWithoutData(
              res,
              res.__('emailAlreadyRegistered'),
              FAIL
            )
          } else {
            const minutesLater = new Date();
            const system_ip = req.clientIp;
            let browser_ip =
              req.headers["x-forwarded-for"] || req.connection.remoteAddress;

            const pass = await bcrypt.hash(requestParams.password, 10);


            const UserObj = {
              first_name: requestParams.first_name,
              last_name: requestParams.last_name,
              username: requestParams.username.toLowerCase(),
              email: requestParams.email,
              password: pass,
              password_text: requestParams.password,
              mobile_no: requestParams.mobile_no,
              device_code: requestParams.device_code.toLowerCase(),
              "ip_address.system_ip": system_ip,
              "ip_address.browser_ip": browser_ip,
              status: INACTIVE
            };

            let user = await User.create(UserObj);

            let userWallet = await UserWallet.create({ userId: user?._id, coin: USER_WALLET.COIN, diamond: USER_WALLET.DIAMOND });

            await User.updateOne({ _id: user?._id }, {
              wallet_id: userWallet?._id
            });

            const restTokenExpire = minutesLater.setMinutes(
              minutesLater.getMinutes() + USER_MODEL.EMAIL_VERIFY_OTP_EXPIRY_MINUTE
            );

            const otp = await makeRandomNumber(4);
            const otpObj = {
              user_id: user._id,
              otp: otp,
              code_expiry: restTokenExpire,
            };

            await Otp.deleteMany({ user_id: user._id });
            await Otp.create(otpObj);

            const locals = {
              username: requestParams.first_name,
              appName: AppName,
              otp: otp
            };

            Mailer.sendMail(requestParams.email, "registration", userEmailVerification, locals);

            return Response.successResponseWithoutData(
              res,
              res.__('UserAddedSuccessfully'),
              SUCCESS
            );
          }
        }
      });

      // Hash the password
      // const hashedPassword = await bcrypt.hash(requestParams.password, 10);

      // const newUser = new User({ first_name: requestParams.username, last_name: requestParams.username, username: requestParams.username, password: hashedPassword, email: requestParams.email });
      // await newUser.save();

      // res.status(201).json(newUser);
    } catch (error) {
      console.log("error", error);
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  /**
 * @description "This function is for verify mail."
 * @param req
 * @param res
 */
  verifyEmail: async (req, res) => {
    try {
      const requestParams = req.body;
      // Below function will validate all the fields which we are passing in the body.
      verifyEmailValidation(requestParams, res, async (validate) => {
        if (validate) {
          let user = await User.findOne({
            email: requestParams.email
          }, { _id: 1, email_verify: 1 });
          if (user) {
            if (user.email_verify) {
              Response.errorResponseWithoutData(
                res,
                res.locals.__('emailAlreadyVerified'),
                FAIL,
              );
            } else {
              let otpQuery = {
                user_id: user._id,
                otp: requestParams.otp,
              }
              let otpResult = await Otp.findOne(otpQuery, { code_expiry: 1 });
              if (otpResult) {
                const system_ip = req.clientIp;
                let browser_ip =
                  req.headers["x-forwarded-for"] || req.connection.remoteAddress;

                const currentTime = new Date();
                const otpExpiry = new Date(otpResult.code_expiry)

                if (currentTime.getTime() > otpExpiry.getTime()) {
                  return Response.errorResponseWithoutData(
                    res,
                    res.locals.__('otpExpired'),
                    FAIL,
                  )
                } else {
                  const currentDateAndTime = moment().toDate();

                  await User.updateOne(
                    { _id: user?._id },
                    { $set: { email_verify: currentDateAndTime, "ip_address.system_ip": system_ip, "ip_address.browser_ip": browser_ip, status: ACTIVE } }
                  );

                  await Otp.deleteMany({ user_id: user._id });

                  return Response.successResponseData(
                    res,
                    res.locals.__("emailVerified"),
                    SUCCESS
                  );
                }
              } else {
                Response.errorResponseWithoutData(
                  res,
                  res.locals.__('otpNotExist'),
                  FAIL,
                );
              }
            }

          } else {
            Response.errorResponseWithoutData(
              res,
              res.locals.__('emailNotExist'),
              FAIL,
            );
          }
        }
      });
    } catch (error) {
      return Response.errorResponseData(
        res,
        error.message,
        INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is for re-send otp."
   * @param req
   * @param res
   */
  resendOtp: async (req, res) => {
    try {
      const requestParams = req.body;
      // Below function will validate all the fields which we are passing in the body.
      resendEmailValidation(requestParams, res, async (validate) => {
        if (validate) {
          let user = await User.findOne({
            email: requestParams.email
          }, { _id: 1, first_name: 1, email: 1 });
          if (user) {
            var currentDate = new Date();
            const system_ip = req.clientIp;
            let browser_ip =
              req.headers["x-forwarded-for"] || req.connection.remoteAddress;

            var otpTokenExpire = new Date(currentDate.getTime() + USER_MODEL.EMAIL_VERIFY_OTP_EXPIRY_MINUTE * 60000); // 10 minutes * 60000 ms/min
            const otp = await makeRandomNumber(4);

            const otpObj = {
              user_id: user._id,
              otp: otp,
              code_expiry: otpTokenExpire,
            };
            await Otp.deleteMany({ user_id: user._id });
            await Otp.create(otpObj);

            await User.updateOne(
              { _id: user?._id },
              { $set: { "ip_address.system_ip": system_ip, "ip_address.browser_ip": browser_ip } }
            );

            let locals = {
              first_name: user.first_name,
              appName: AppName,
              otp: otp
            }

            Mailer.sendMail(user.email, "resend otp", resendOtp, locals);

            return Response.successResponseWithoutData(
              res,
              res.__('emailResend'),
              SUCCESS
            );
          } else {
            Response.errorResponseWithoutData(
              res,
              res.locals.__('emailNotExist'),
              FAIL,
            );
          }
        }
      });
    } catch (error) {
      console.log("error", error);

      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  /**
 * @description "This function is to get unique user name."
 * @param req
 * @param res
 */
  getUserName: async (req, res) => {
    try {
      const requestParams = req.query;
      // Below function will validate all the fields which we are passing in the body.
      userNameValidation(requestParams, res, async (validate) => {
        if (validate) {
          let user = await User.findOne({
            username: requestParams.username
          }, { _id: 1, username: 1 });
          if (user) {
            return Response.successResponseWithoutData(
              res,
              res.__('userAlreadyExist'),
              SUCCESS
            );
          } else {
            Response.errorResponseWithoutData(
              res,
              res.locals.__('userNotExist'),
              FAIL,
            );
          }
        }
      });
    } catch (error) {
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  /**
* @description "This function is to get unique user name."
* @param req
* @param res
*/
  getUserDetail: async (req, res) => {
    try {
      const requestParams = req.query;
      // Below function will validate all the fields which we are passing in the body.
      userDetailValidation(requestParams, res, async (validate) => {
        if (validate) {
          let user = await User.findOne({
            _id: requestParams.user_id
          }, { _id: 1 }).populate("wallet_id");

          return Response.successResponseData(
            res,
            user,
            SUCCESS,
            res.locals.__("success"),
          );
        }
      });
    } catch (error) {
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  /**
* @description "This function is to get users with same device."
* @param req
* @param res
*/
  getUsersSameDevice: async (req, res) => {
    try {
      const requestParams = req.query;
      // Below function will validate all the fields which we are passing in the body.
      usersSameDeviceValidation(requestParams, res, async (validate) => {
        if (validate) {
          let user = await User.find({
            device_code: requestParams.device_code
          }, { _id: 1, username: 1, device_code: 1 });
          if (user?.length > 0) {
            return Response.successResponseWithData(
              res,
              user,
              res.locals.__("usersWithSameDevice"),
              SUCCESS
            );
          } else {
            Response.errorResponseWithoutData(
              res,
              res.locals.__('userNotExist'),
              FAIL,
            );
          }
        }
      });
    } catch (error) {
      console.log("error", error);

      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },
};
