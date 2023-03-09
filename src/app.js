const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const koaBody = require('koa-body');
const path = require('path');
const { rabbitKey } = require('./service/robot/robotsConf');
const childProcess = require('child_process');
const { isFriday, getHours } = require('date-fns');
const { exec } = childProcess;
const server = require('./router/server');
const tiny = require('./router/tiny');
const NODE_ENV = process.env.NODE_ENV; // development production

// 实例
const app = new Koa();
const router = new Router();
// 跨域
// app.use(cors());
// 上传文件
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../../temp/'), // temp
      keepExtensions: true,
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，200M
    },
  })
);
app.context.linkList = [];
setTimeout(() => {
  app.context.linkList = [];
}, 60 * 60 * 1000);
// 装载所有路由并且分类
router.use('/server', server.routes(), server.allowedMethods());
router.use('/t', tiny.routes(), tiny.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());
// 监听端口
app.listen(3224);
