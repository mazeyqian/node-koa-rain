// 上传
const fs = require('fs');
const path = require('path');
const { rsp, ossRsp } = require('../../entities/response');
const { newAsset, getAsset, removeAsset } = require('../../model/asset');
const { mGetOSSConfs, mNewOSSConf, mNewGetOSSConfs, mAddOSSConf } = require('../../model/oss');
// const { ossPut, ossMultipartUpload } = require('./alioss');
const { sGetUid } = require('../user');
const { err } = require('../../entities/err');
const { isNumber } = require('mazey');
const { format } = require('date-fns');
const mkdir = require('../../utils/mkdir');
// 上传单个文件
async function upload (ctx) {
  const file = ctx.request.files.file; // 获取上传文件
  let fileUrl = 'assets/' + file.type;
  let res = await mkdir.mkdirs(fileUrl, err => {
    console.log('err', err); // 错误的话，直接打印如果地址跟
  });
  console.log('res----------------------------------', res);
  const target = ctx.query.target || 'assets'; // 上传目录，默认 asset 生产https://i.mazey.net/assets/aaa.jpg  生产和开发区分/web/i.mazey.net/assets/aaa.jpg
  let uid = Number(ctx.query.uid) || 0;
  // 通过指纹拿到 uid
  if (!uid) {
    try {
      ({
        data: { uid = 0 },
      } = await sGetUid(ctx));
    } catch (err) {
      console.error(err);
    }
  }
  const tFilePath = file ? file.path : '';
  // 创建可读流
  const reader = fs.createReadStream(tFilePath);
  const { size: fileSize, type: fileType } = file;
  let fileName = file.name || 'upload';
  let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>《》/?~!@#￥……&*()——|{}【】‘;:”“'。,、? ]");
  if (pattern.test(fileName)) {
    // 有特殊字符就去掉
    let rs = '';
    for (let i = 0; i < fileName.length; i++) {
      rs += fileName.substr(i, 1).replace(pattern, '');
    }
    fileName = rs;
  }
  fileName = format(Date.now(), 'yyyy-MM-dd') + '-' + Math.round(Math.random() * 1e9) + '-' + fileName;
  let downloadFileUrl = `../../../../assets/${file.type}/`;
  const filePath = path.join(__dirname, downloadFileUrl) + `${fileName}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 控制流文件状态
  let ok;
  const status = new Promise(resolve => {
    ok = resolve;
  }, console.error);
  let cdnDomain = process.env.NODE_ENV === 'development' ? 'http://localhost:8224/' : 'https://i.mazey.net/';
  let ossResult = '';
  // 生成入库字段
  const assetLink = ''; // `https://mazey.cn/assets/${fileName}`;
  const showLink = `${cdnDomain}${target}/${fileName}`;
  // 入库
  await newAsset({
    asset_oss_id: 0,
    asset_link: assetLink,
    asset_oss_link: ossResult,
    asset_show_link: showLink,
    asset_target: target,
    asset_type: fileType,
    asset_size: fileSize,
    asset_operator_id: uid,
    asset_file_name: fileName,
    token: ctx.query.token,
  });
  ok(
    rsp({
      data: ossRsp({
        // assetLink,
        ossLink: ossResult,
        showLink,
        target,
        fileSize,
        fileType,
        fileName,
        createAt: new Date(),
      }),
    })
  );
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return status;
}

// 查询静态资源
async function getAssets ({ ctx, token, asset_operator_id }) {
  console.log('_ asset_operator_id:', asset_operator_id);
  const limit = Boolean(ctx.query.limit) && Number(ctx.query.limit);
  const assets = await getAsset({ asset_oss_id: Number(ctx.query.oss_id), token, limit });
  if (!assets) {
    return err({ message: '查询错误' });
  }
  const ret = assets.map(ossRsp);
  return rsp({ data: { assets: ret } });
}

// 删除记录
async function sRemoveAsset (ctx) {
  const { asset_id } = ctx.request.body;
  const removeAssetResult = await removeAsset({ asset_id });
  let ret;
  if (Array.isArray(removeAssetResult) && isNumber(removeAssetResult[0]) && removeAssetResult[0] > 0) {
    ret = rsp({ data: { asset_id } });
  } else {
    ret = err();
  }
  return ret;
}

// 查询 oss 列表
async function sGetOSSConfs (ctx) {
  const uidRes = await sGetUid(ctx);
  // if (uidRes.ret !== 0) return uidRes;
  const {
    data: { uid },
  } = uidRes;
  const access_token = ctx.query.access_token || '';
  const ossConfs = (await mGetOSSConfs({ oss_user_id: uid, access_token })).map(({ oss_id, oss_name }) => ({ ossId: oss_id, ossName: oss_name }));
  return rsp({ data: { ossConfs } });
}

// [新]查询 oss 列表
async function sNewGetOSSConfs ({ token }) {
  if (!token) {
    return err({ message: '缺少 Token' });
  }
  const NewGetOSSConfsRes = await mNewGetOSSConfs({ token });
  if (NewGetOSSConfsRes.ret !== 0) {
    return NewGetOSSConfsRes;
  }
  const {
    data: { OSSConfs: newOSSConfs },
  } = NewGetOSSConfsRes;
  if (!newOSSConfs.length) {
    return err({ message: '无 OSS 配置' });
  }
  const ossConfs = newOSSConfs.map(({ oss_id, oss_name }) => ({ ossId: oss_id, ossName: oss_name }));
  return rsp({ data: { ossConfs } });
}

// 创建新 oss 配置
async function sNewOSSConf (ctx) {
  const uidRes = await sGetUid(ctx);
  const {
    data: { uid },
  } = uidRes;
  const newConfRes = await mNewOSSConf({ oss_user_id: uid, ...ctx.query });
  if (!newConfRes) {
    return err({ info: 'err_save_oss_conf' });
  }
  return rsp();
}

// [新]创建新 oss 配置
async function sAddOSSConf ({ ossName, region, accessKeyId, accessKeySecret, bucket, cdnDomain, userName }) {
  if (!ossName) {
    return err({ message: '缺少名字' });
  }
  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    return err({ message: '缺少 OSS 参数' });
  }
  if (!userName) {
    return err({ message: '非正常路径创建' });
  }
  const AddOSSConfRes = await mAddOSSConf({ ossName, region, accessKeyId, accessKeySecret, bucket, cdnDomain, userName });
  if (AddOSSConfRes.ret === 0) {
    return AddOSSConfRes;
  }
  return err({ info: 'err_save_oss_conf' });
}

module.exports = {
  upload,
  getAssets,
  sGetOSSConfs,
  sNewOSSConf,
  sRemoveAsset,
  sNewGetOSSConfs,
  sAddOSSConf,
};
