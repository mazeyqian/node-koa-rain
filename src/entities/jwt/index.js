const jwt = require('jsonwebtoken');
const config = {
  secret: '20230319123456**',
  time: 60 * 60,
};
function jwtCreate (data, time) {
  console.log('执行了嘛');
  let token = jwt.sign(data, config.secret, {
    algorithm: 'HS256',
    expiresIn: time || config.time,
  });
  return token;
}
function jwtVerify (token) {
  return jwt.verify(token, config.secret, function (err, jwtDecoded) {
    if (err) {
      return {
        code: 1,
        msg: 'invalid',
        data: null,
      };
    } else {
      return {
        code: 2,
        msg: 'valid',
        data: jwtDecoded,
      };
    }
  });
}
function jwtDecoded (token, complete = true) {
  return jwt.decode(token, {
    complete,
  });
}
module.exports = {
  jwtCreate,
  jwtVerify,
  jwtDecoded,
};
