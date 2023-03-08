// 短链接服务
const md5 = require('md5');
const { rsp } = require('../entities/response');
const { convert26 } = require('../utils/utils');
const { queryOriLink, saveOriLink, queryTinyLink, saveTinyLink } = require('../model/tiny');

// 生成短链接
async function sGenerateShortLink ({ ori_link }) {
  // 是否已存在
  const ori_md5 = md5(ori_link);
  const queryOriLinkResult = await queryOriLink({ ori_md5 });
  const domain = 'https://mazey.cn';
  let tiny_link = '';
  if (!queryOriLinkResult) {
    // 新增长链接
    const saveOriLinkResult = await saveOriLink({ ori_link, ori_md5 });
    const { tiny_id } = saveOriLinkResult;
    const tiny_key = convert26(tiny_id);
    tiny_link = `${domain}/t/${tiny_key}`;
    await saveTinyLink({ tiny_id, tiny_link, tiny_key });
  } else {
    // 查询短链接
    ({ tiny_link } = queryOriLinkResult);
  }
  return rsp({
    data: {
      tiny_link,
    },
  });
}

// 查询短链接
async function queryShortLink ({ tiny_key }) {
  const queryTinyLinkResut = await queryTinyLink({ tiny_key });
  return rsp({
    data: {
      queryTinyLinkResut,
    },
  });
}

// 长链接
async function queryOriLinkByKey ({ tiny_key }) {
  let ori_link;
  const specialLink = new Map([
    ['ca', 'https://tool.mazey.net/rabbit-read/#/home'], // 小兔读书会首页
    ['cs', 'https://tool.mazey.net/rabbit-read/?from=robot#/home'], // 小兔读书会首页（机器人导流）
    ['cp', 'https://tool.mazey.net/rabbit-read/#/note'], // 小兔读书会笔记
    ['cr', 'https://tool.mazey.net/rabbit-read/#/statistic'], // 小兔读书会数据统计
    ['aa', 'https://rabbitimage.rabbitcdn.com/asset/read/#rabbit.png'], // test
  ]);
  if (specialLink.has(tiny_key)) {
    ori_link = specialLink.get(tiny_key);
  } else {
    ({ ori_link = 'https://blog.mazey.net/tiny' } = (await queryTinyLink({ tiny_key })) || {});
  }
  return rsp({
    data: {
      ori_link,
    },
  });
}

module.exports = {
  sGenerateShortLink,
  queryShortLink,
  queryOriLinkByKey,
};
