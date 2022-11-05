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
async function sAddNewUser (ctx, nick_name, real_name = '') {
  if (!nick_name) {
    return err({ message: '缺少昵称' });
  }
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
  // 新增用户
  const acquireNewUserRes = await acquireNewUser({
    user_name: nick_name,
    real_name,
    user_signup_ip: ip,
    user_fingerprint: md5(nick_name),
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
  sGetUid,
  sGetUserInfo,
  sAddNewUser,
  sGetIP,
  sLogin,
  sGenToken,
};
