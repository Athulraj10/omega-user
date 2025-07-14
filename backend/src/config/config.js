const { config:configured } = require("./configAll");

module.exports.getConfig = () => {
  const config = {
    'MODE': 'development',
    'MONGO_CONNECTION_STRING': configured.mongoUri
  };

  // Modify for Production
  if (process.env.NODE_ENV === 'development') {
    config.MODE = 'development';
  } else if (process.env.NODE_ENV === 'staging') {
    config.MODE = 'staging';
  }
  else if (process.env.NODE_ENV === 'pre_prod') {
    config.MODE = 'pre_prod';
  }
  else if (process.env.NODE_ENV === 'production') {
    config.MODE = 'Production';
  }

  return config;
};