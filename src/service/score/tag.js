const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { mAddNewTags } = require('../../model/tag');
const { mAddNewGameTags } = require('../../model/game');
const { sRobotRemindForConfirmTag } = require('../../service/robot/robot');
const Joi = require('joi');
async function sIsAddNewTags (ctx, { user_id, game_id, tag_name }) {
  const jwtToken = ctx.state.user;
  let params = {
    ctx,
    key: '',
    alias: 'pigKey',
    tags: ['标签添加'],
    tagList: tag_name,
    user_id: user_id || (jwtToken && jwtToken.data ? jwtToken.data.user_id : ''),
    game_id,
    contents: [
      {
        name: 'host',
        value: 'localhost:3224',
      },
      {
        name: 'url',
        value: '/server/tag/add',
      },
      {
        name: 'env',
        value: process.env.NODE_ENV,
      },
    ],
  };
  const robotRemindForConfirmTagRes = await sRobotRemindForConfirmTag({ ...params });
  console.log('mAddNewTagsRes', robotRemindForConfirmTagRes);
  return robotRemindForConfirmTagRes;
}
// 批量增加标签,主要判重
async function sAddNewTags (ctx, { user_id, game_id, tag_name }) {
  console.log('tag_name', typeof tag_name);
  const schema = Joi.object({
    game_id: Joi.number()
      .integer()
      .required()
      .error(new Error('请选择游戏')),
  });
  const { error } = schema.validate({
    game_id,
  });
  if (typeof tag_name === 'string') {
    tag_name = tag_name.split(',');
  }
  if (error) {
    return err({ message: error.message });
  }
  const jwtToken = ctx.state.user;
  console.log('user_id', user_id);
  const mAddNewTagsRes = await mAddNewTags({
    user_id: user_id || (jwtToken && jwtToken.data ? jwtToken.data.user_id : ''),
    game_id,
    tag_name,
  });
  let tagData = mAddNewTagsRes.data;
  if (mAddNewTagsRes.data) {
    const mAddNewGameTagsRes = await mAddNewGameTags({
      game_id,
      data: tagData,
    });
  }
  return mAddNewTagsRes;
}
module.exports = {
  sIsAddNewTags,
  sAddNewTags,
};
