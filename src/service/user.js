// 用户
const { err } = require('../entities/err');
const { rsp } = require('../entities/response');
const { getUid, acquireNewUser, mLogin, mGenToken } = require('../model/user');
const WeatherApi = require('./weather/weather');
const WeatherConf = require('../secret/weather');
const weatherIns = new WeatherApi(WeatherConf.UID, WeatherConf.KEY);
const axios = require('axios');
const { format } = require('date-fns');
const md5 = require('md5');
const nodemailer = require('nodemailer');
// 获取 uid
async function sGetUid (ctx) {
  if (ctx.query.uid) return rsp({ data: { uid: Number(ctx.query.uid) } });
  const uidRes = await getUid(ctx.query);
  if (uidRes === false) {
    return err({ info: 'err_uid_params_error', data: { uid: 0 } });
  }
  if (uidRes === null) {
    return err({ info: 'err_not_find', data: { uid: 0 } });
  }
  const { user_id: uid } = uidRes;
  return rsp({ data: { uid } });
}

// 获取用户 IP 城市 天气
async function sGetUserInfo (ctx) {
  // ip
  const headers = ctx.request.headers;
  const XForwardedFor = headers['x-forwarded-for'] || '';
  const ip = (XForwardedFor.split(', ') && XForwardedFor.split(', ')[0]) || '114.88.250.157';
  // 城市
  let ret = null;
  let ipResult = null;
  try {
    ipResult = await axios
      .get('http://saip.market.alicloudapi.com/ip', {
        params: {
          ip,
        },
        headers: {
          Authorization: 'APPCODE #rabbit',
        },
      })
      .catch(console.error);
  } catch (error) {
    return err({ message: 'saip error' });
  }
  if (ipResult && ipResult.status && ipResult.status === 200) {
    ret = ipResult.data;
  }
  let showapi_res_body = {};
  if (ret) {
    showapi_res_body = ret['showapi_res_body'] || {};
  }
  const {
    isp: operator = '', // 运营商
    continents: continent = '', // 洲
    country = '', // 国
    region: province = '', // 省
    city = '', // 市
    county = '', // 县
    lnt = '', // 经
    lat = '', // 纬
  } = showapi_res_body;
  const location = { operator, continent, country, province, city, county, lnt, lat };
  // 天气
  const weatherLocation = county || city || province;
  let daily = [];
  if (ret) {
    try {
      ({
        results: [{ daily }],
      } = await weatherIns
        .getWeatherDaily(weatherLocation)
        .then(function (data) {
          return data;
        })
        .catch(console.error));
    } catch (error) {
      return err({ message: 'getWeatherDaily error' });
    }
  }
  const dailyDate = format(Date.now(), 'yyyy-MM-dd');
  const dailyItems = daily.filter(v => v.date === dailyDate);
  const thatDailyW = (dailyItems.length && dailyItems[0]) || {};
  const { text_day: dayWeather, high: temperatureHigh, low: temperatureLow } = thatDailyW;
  const weather = { dayWeather, temperatureHigh, temperatureLow };
  return rsp({ data: { ip, location, weather } });
}

// 添加新用户
async function sendMail (sendMail) {
  const config = {
    service: '163',
    auth: {
      // 发件人邮箱账号
      user: '18756272368@163.com', // 发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
      pass: '1', // 授权码生成之后，要等一会才能使用，否则验证的时候会报错
    },
  };
  const transporter = nodemailer.createTransport(config);
  let code = Array.from(new Array(6), () => Math.floor(Math.random() * 9)).join(''); // 先随便生成一个6位数字
  // 创建一个收件人对象
  const mail = {
    // 发件人 邮箱 '昵称<发件人邮箱>'
    from: `18756272368@163.com`,
    // 主题
    subject: '邮箱校验通知',
    // 收件人 的邮箱
    to: sendMail,
    // 这里可以添加html标签
    html: code,
  };
  transporter.sendMail(mail, function (error, info) {
    if (error) {
      return false;
    }
    transporter.close();
    console.log('mail sent:', info.response);
    return code;
  });
}
async function sAddNewUser (ctx, nick_name, real_name = '', user_password = '', user_email = '') {
  if (!nick_name) {
    return err({ message: '缺少昵称' });
  }
  let regTest = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
  if (!regTest.test(nick_name)) {
    return err({ message: '昵称不符合规范,请重新输入' });
  }
  let emailRegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (user_email && !emailRegExp.test(user_email)) {
    return err({ message: '邮箱输入错误,请重新输入' });
  }
  let sendMailData = await sendMail(user_email);
  console.log('sendMailData', sendMailData);
  const GetUserInfoRes = await sGetUserInfo(ctx);
  if (GetUserInfoRes.ret !== 0) {
    return GetUserInfoRes;
  }
  const {
    data: {
      ip,
      location: { city },
    },
  } = GetUserInfoRes;
  console.log('GetUserInfoRes------城市信息', GetUserInfoRes);
  // 新增用户
  const {
    data: { token: requestPassword },
  } = user_password ? mGenToken({ str: user_password }) : { data: { token: '' } };
  const acquireNewUserRes = await acquireNewUser({
    user_name: nick_name,
    user_email,
    user_email_code: sendMailData,
    real_name,
    user_signup_ip: ip,
    user_fingerprint: md5(nick_name),
    user_password: requestPassword,
    user_signup_city: city,
  });
  if (acquireNewUserRes.ret !== 0) {
    return acquireNewUserRes;
  }
  return acquireNewUserRes;
}

// 添加新用户
async function sGetIP (ctx) {
  const headers = ctx.request.headers;
  const XForwardedFor = headers['x-forwarded-for'] || '';
  const ip = (XForwardedFor.split(', ') && XForwardedFor.split(', ')[0]) || '0.0.0.0';
  return rsp({ data: { ip } });
}

// 登录
async function sLogin ({ ctx, user_name, user_password }) {
  console.log('_ ctx:', ctx);
  if (!user_name) {
    return err({ message: '请输入用户名' });
  }
  if (!user_password) {
    return err({ message: '请输入密码' });
  }
  return mLogin({ user_name, user_password });
}

// 生成 Token
function sGenToken ({ str }) {
  return mGenToken({ str });
}

module.exports = {
  sendMail,
  sGetUid,
  sGetUserInfo,
  sAddNewUser,
  sGetIP,
  sLogin,
  sGenToken,
};
