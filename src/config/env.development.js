// const $mysql_server_name = 'localhost'; // Server
// const $mysql_username = 'localuser'; // User
// const $mysql_password = 'localpassword'; // Password
// const $mysql_database = 'mazey'; // Name
const $mysql_server_name = 'localhost'; // Server
const $mysql_username = 'root'; // User
const $mysql_password = '123456'; // Password
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
// Robot Keys
const rabbitKey = '#rabbit';
// 小橘子 错误监控
const orangeKey = '#rabbit';
const testCarKey = '#rabbit';
const strongerKey = '#rabbit';
const readKey = rabbitKey;
const forumFEHelperKey = '#rabbit';
const TestUrl = '#rabbit';
// Alias
const alias2Key = new Map([
  // 小兔子 Rabbit Daily
  ['rabbitKey', rabbitKey],
  // 小橘子 Orange Error
  ['orangeKey', orangeKey],
  ['testCarKey', testCarKey],
  ['strongerKey', strongerKey],
  ['forumFEHelperKey', forumFEHelperKey],
  ['getOffKey', '#rabbit'],
  ['touchFish01Key', '#rabbit'],
  ['touchFish02Key', '#rabbit'],
  ['communityFEServerErrorUrl', '#rabbit'],
  ['communityFEServerTestUrl', '#rabbit'],
  ['feishuTest', '#rabbit'],
  ['feishuStronger', '#rabbit'],
  ['forHeart', '#rabbit'],
  ['strongerGroup', '#rabbit'],
  ['stronger001', '#rabbit'],
  ['TestUrl', TestUrl],
]);

module.exports = {
  mysqlConf,
  WeatherConf,
  testCarKey,
  strongerKey,
  readKey,
  rabbitKey,
  forumFEHelperKey,
  orangeKey,
  alias2Key,
  TestUrl,
};
