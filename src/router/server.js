const { getCityInfo } = require('./../service/ip');
const { getLatestVisitors, sAgentGet, sAgentPut, sAgentAny, sShowRequestInfo } = require('./../service/visitor');
const { upload, getAssets, sGetOSSConfs, sNewOSSConf, sRemoveAsset, sNewGetOSSConfs, sAddOSSConf } = require('./../service/upload');
const { uploadFile } = require('./../service/upload/upload');
const { report } = require('./../model/report');
const { sGetUserInfo, sLogin, sGenToken } = require('./../service/user');
const { sGenerateShortLink, queryShortLink } = require('./../service/tiny');
const {
  sPunchCard,
  sGetFeeds,
  sAddWiki,
  sGetWikis,
  sGetAllWikis,
  sUpdateCard,
  sGetRecentCard,
  sGetCardIntegral,
  sGetWikiIntegral,
  sToggleLikes,
  sGetRecentAchievement,
} = require('./../service/nut/read');
const { sRobotRemindFeperf, sRobotSendText, sRobotRemindForCommonTag } = require('./../service/robot/robot');
const { rabbitKey } = require('./../service/robot/robotsConf');
const { rsp } = require('./../entities/response');
const { sAddLog, sReportErrorInfo } = require('./../service/log');
const Router = require('koa-router');
const server = new Router();
const WeatherApi = require('../service/weather/weather');
const WeatherConf = require('./../secret/weather');
const { sGetRobotKeyByAlias } = require('../service/robot');
const { sGetWeatherDaily } = require('../service/weather');
const { sGetToken, sGetTicket } = require('../service/weixin');
const weatherIns = new WeatherApi(WeatherConf.UID, WeatherConf.KEY);

server
  // Ping
  .get('/ping', async ctx => {
    ctx.body = 'ok';
  })
  // User
  .post('/user/login', async ctx => {
    const { user_name, user_password } = ctx.request.body;
    ctx.body = await sLogin({ user_name, user_password });
  })
  .post('/user/gen-token', async ctx => {
    const { str } = ctx.request.body;
    ctx.body = await sGenToken({ str });
  })
  .get('/user/info', async ctx => {
    ctx.body = await sGetUserInfo(ctx);
  })
  // Robot
  .post('/robot/feperf', async ctx => {
    ctx.body = await sRobotRemindFeperf(ctx);
  })
  .post('/robot/send-text', async ctx => {
    const { message } = ctx.request.body;
    await sRobotSendText({ message, key: rabbitKey, immediately: true });
    ctx.body = rsp();
  })
  .post('/robot/tags', async ctx => {
    const { tags = [], contents = [], extra = {}, key = '', alias = '' } = ctx.request.body;
    const RobotRemindForCommonTagRes = await sRobotRemindForCommonTag({ ctx, tags, contents, extra, key, alias });
    ctx.body = RobotRemindForCommonTagRes;
  })
  .get('/robot/sGetRobotKeyByAlias', async ctx => {
    const { alias } = ctx.query;
    ctx.body = await sGetRobotKeyByAlias({ alias });
  })
  // Log
  .post('/log/add', async ctx => {
    const { log_type, content } = ctx.request.body;
    ctx.body = await sAddLog({ ctx, log_type, content });
  })
  .post('/log/report-error-info', async ctx => {
    const { logType, err, pageTitle, url, alias } = ctx.request.body;
    ctx.body = await sReportErrorInfo({ ctx, logType, err, pageTitle, url, alias });
  })
  // Tiny
  .post('/generate/short-link', async ctx => {
    const { ori_link } = ctx.request.body;
    ctx.body = await sGenerateShortLink({ ori_link });
  })
  // Query
  .get('/query/short-link', async ctx => {
    const { tiny_key } = ctx.query;
    ctx.body = await queryShortLink({ tiny_key });
  })
  // Weather
  .get('/weather/now', async ctx => {
    await weatherIns
      .getWeatherNow()
      .then(function (data) {
        ctx.body = `getWeatherNow(${JSON.stringify(data, null, 4)})`;
      })
      .catch(function (err) {
        ctx.body = `getError(${err.error.status})`;
      });
  })
  .get('/weather/daily', async ctx => {
    await weatherIns
      .getWeatherDaily()
      .then(function (data) {
        ctx.body = `getWeatherDaily(${JSON.stringify(data, null, 4)})`;
      })
      .catch(function (err) {
        ctx.body = `getError(${err.error.status})`;
      });
  })
  .get('/weather/new-daily', async ctx => {
    const { location } = ctx.query;
    ctx.body = await sGetWeatherDaily({ location });
  })
  // Visitor IP
  .get('/ip', async ctx => {
    const ctxQuery = ctx.query;
    const { callback = 'console.log', referrermz = '', hrefmz = '', titlemz = '', visitor_fingerprint = '' } = ctxQuery;
    const headers = ctx.request.headers;
    const XForwardedFor = headers['x-forwarded-for'] || '';
    const realIP = (XForwardedFor.split(', ') && XForwardedFor.split(', ')[0]) || '114.88.250.157';
    const ipRet = await getCityInfo({ ip: realIP, referrermz, hrefmz, titlemz, visitor_fingerprint });
    ctx.body = `${callback}(${JSON.stringify(ipRet)})`;
  })
  .get('/query-visitors', async ctx => {
    ctx.body = await getLatestVisitors();
  })
  // Upload
  .post('/upload', async ctx => {
    ctx.body = await upload(ctx);
  })
  .get('/upload/query', async ctx => {
    const { token } = ctx.query;
    ctx.body = await getAssets({ ctx, token, asset_operator_id: Number(ctx.query.uid) });
  })
  .post('/upload/remove', async ctx => {
    ctx.body = await sRemoveAsset(ctx);
  })
  .get('/upload/confs', async ctx => {
    ctx.body = await sGetOSSConfs(ctx);
  })
  .get('/upload/get-oss-confs', async ctx => {
    const { token } = ctx.query;
    ctx.body = await sNewGetOSSConfs({ token });
  })
  .get('/upload/new-conf', async ctx => {
    ctx.body = await sNewOSSConf(ctx);
  })
  .post('/upload/add-oss-conf', async ctx => {
    const { ossName, region, accessKeyId, accessKeySecret, bucket, cdnDomain, userName } = ctx.request.body;
    ctx.body = await sAddOSSConf({ ossName, region, accessKeyId, accessKeySecret, bucket, cdnDomain, userName });
  })
  // 单个文件上传
  .post('/upload/single', uploadFile.single('file'), (req, res) => {
    res.json({
      code: 200,
      msg: '上传成功!',
      data: req.file,
    });
  })

  // 多个文件上传
  // .post('/upload/array', uploadFile.array('file'), (req, res) => {
  //   res.json({
  //     code: 200,
  //     msg: '上传成功!',
  //     data: req.file,
  //   });
  // })
  // Agent
  .get('/agent/get', async ctx => {
    ctx.body = await sAgentGet(ctx);
  })
  .post('/agent/put', async ctx => {
    ctx.body = await sAgentPut(ctx);
  })
  .post('/agent', async ctx => {
    ctx.body = await sAgentAny(ctx);
  })
  .get('/show-request-info', async ctx => {
    ctx.body = await sShowRequestInfo(ctx);
  })
  // Report
  .get('/report', async ctx => {
    let ret = await report(ctx.query);
    if (ret !== 'success') ret = 'fail';
    ctx.body = ret;
  })
  // Rabbit Read Club
  .post('/nut/punch-card', async ctx => {
    ctx.body = await sPunchCard(ctx);
  })
  .get('/nut/feeds', async ctx => {
    ctx.body = await sGetFeeds(ctx);
  })
  .post('/nut/update-card', async ctx => {
    ctx.body = await sUpdateCard(ctx);
  })
  .post('/nut/read-note', async ctx => {
    ctx.body = await sAddWiki(ctx);
  })
  .get('/nut/get-note', async ctx => {
    ctx.body = await sGetWikis(ctx);
  })
  .get('/nut/get-all-note', async ctx => {
    ctx.body = await sGetAllWikis();
  })
  .get('/nut/get-recent-card', async ctx => {
    ctx.body = await sGetRecentCard(ctx);
  })
  .get('/nut/get-card-integral', async ctx => {
    ctx.body = await sGetCardIntegral(ctx);
  })
  .get('/nut/get-wiki-integral', async ctx => {
    ctx.body = await sGetWikiIntegral(ctx);
  })
  .post('/nut/toggle-likes', async ctx => {
    ctx.body = await sToggleLikes(ctx);
  })
  .get('/nut/get-achivement', async ctx => {
    ctx.body = await sGetRecentAchievement({ nickName: ctx.query.nick_name });
  })
  // Wechat
  .get('/weixin/get-token', async ctx => {
    ctx.body = await sGetToken();
  })
  .get('/weixin/get-ticket', async ctx => {
    ctx.body = await sGetTicket();
  });

module.exports = server;
