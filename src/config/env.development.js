// const $mysql_server_name = 'localhost'; // Server
// const $mysql_username = 'localuser'; // User
// const $mysql_password = 'localpassword'; // Password
// const $mysql_database = 'mazey'; // Name
const $mysql_server_name = 'localhost'; // Server
const $mysql_username = 'root'; // User
const $mysql_password = 'wxt123'; // Password
const $mysql_database = 'mazey'; // Name
const mysqlConf = {
  $mysql_server_name,
  $mysql_username,
  $mysql_password,
  $mysql_database,
};

const UID = '#rabbit'; // User ID
const KEY = '#rabbit'; // Key
const WeatherConf = {
  UID,
  KEY,
};

module.exports = {
  mysqlConf,
  WeatherConf,
};