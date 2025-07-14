module.exports = {
  AppName: "Omega",
  forgotTemplate: "forgotPassword",
  userEmailVerification: "userEmailVerification",
  resendOtp: "resendOtp",

  makeRandomNumberWithLetter: (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  makeRandomNumber: (length) => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  makeRandomOTPNumber: (length) => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  checkNumberType: (value) => {
    if (Number.isInteger(value)) {
      return true; //integer
    } else if (typeof value === "number" && !Number.isInteger(value)) {
      return false; //float
    } else {
      return false; //NaN
    }
  },

  toUpperCase: (str) => {
    if (str.length > 0) {
      const newStr = str
        .toLowerCase()
        .replace(/_([a-z])/, (m) => m.toUpperCase())
        .replace(/_/, "");
      return str.charAt(0).toUpperCase() + newStr.slice(1);
    }
    return "";
  },

  validationMessageKey: (apiTag, error) => {
    let key = module.exports.toUpperCase(error.details[0].context.key);
    let type = error.details[0].type.split(".");
    type = module.exports.toUpperCase(type[1]);
    key = apiTag + key + type;
    return key;
  },

  generateUniqueSessionId: () => {
    return Math.random().toString(36).substring(2, 15); // Example session ID generation
  },

  resolveAvatarUrl: (userData) => {
    return userData?.google_pic
      ? mediaUrlForS3(`${PROFILE_PIC}`, userData._id, userData.google_pic)
      : userData?.profile_pic
        ? mediaUrlForS3(`${PROFILE_PIC}`, userData._id, userData.profile_pic)
        : "";
  },

  validateObjectIds: (ids) => {
    const idList = Array.isArray(ids) ? ids : [ids];

    const validIds = [];
    const invalidIds = [];

    for (const id of idList) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        validIds.push(id);
      } else {
        invalidIds.push(id);
      }
    }

    return {
      validIds,
      invalidIds,
      allValid: invalidIds.length === 0,
    };
  },

  sanitizeUser: (user) => {
    const {
      password,
      password_text,
      wallet_id,
      addresses_id,
      ip_address,
      device_code,
      email_verify,
      status,
      role,
      roleLevel,
      createdAt,
      updatedAt,
      __v,
      last_login,
      token,
      currencyId,
      ...safeUser
    } = user;
    return safeUser;
  },
  sanitizeAddress: (address) => {
    if (!address) return null;

    const {
      _id,
      userId,
      label,
      addressLine1,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault
    } = address;
    return {
      id: _id,
      userId,
      label,
      addressLine1,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault
    };
  },
  sanitizeWallet: (wallet) => {
    if (!wallet) return null;

    const {
      _id,
      userId,
      coin = 0,
      diamond = 0,
      balance = 0,
      currencyId,
    } = wallet;
    return {
      id: _id,
      userId,
      coin,
      diamond,
      balance,
      currency: {
        id: currencyId._id,
        code: currencyId.code,
        name: currencyId.name,
        value: currencyId.value,
      }
    };
  }
};
