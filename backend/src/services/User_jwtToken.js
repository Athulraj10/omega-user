const jwt = require("jsonwebtoken");

// Generates an uploads token
module.exports.issueUser = function (payload) {
  return jwt.sign(
    {
      id: payload.id,
    },
    process.env.JWT_USER_SECRETKEY || "ksdafjvt8uigojcc329ru",
    { algorithm: "HS512" }
  );
};

// Verifies uploads token
module.exports.verify = function (token, callback) {
  try {
    return jwt.verify(token, process.env.JWT_USER_SECRETKEY || "ksdafjvt8uigojcc329ru", {}, callback);
  } catch (err) {
    return "error";
  }
};

// Decode token on a request and get without bearer
module.exports.decode = async (token) => {
  const parts = token.split(" ");
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
    return false;
  }
  return false;
};
