const ENV = process.env.NODE_ENV;
const envConfig = require(`./env.${ENV}`);

console.log('envConfig', envConfig);

module.exports = envConfig;
