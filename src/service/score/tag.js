const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { mAddNewTags } = require('../../model/tag');
const { mAddNewGameTags } = require('../../model/game');
const { sRobotRemindForConfirmTag } = require('../../service/robot/robot');
const Joi = require('joi');
// 批量增加标签,主要判重
async function sAddNewTags (ctx, { game_id, tag_name }) {
  const schema = Joi.object({
    game_id: Joi.number()
      .integer()
      .required()
      .error(new Error('请选择游戏')),
  });
  const { error } = schema.validate({
    game_id,
  });
  if (error) {
    return err({ message: error.message });
  }
  const jwtToken = ctx.state.user;
  const mAddNewTagsRes = await mAddNewTags({
    game_id,
    tag_name,
  });
  // const tagInstances = tags.map((tag) => tag[0]);
  let tagData = mAddNewTagsRes.data;
  // let tagIds = tagData.map(item => {
  //   return {
  //     value: item[0].tag_id,
  //     name: item[0].tag_name
  //   }
  // })
  let params = {
    ctx,
    key: '',
    alias: 'pigKey',
    tags: ['标签添加'],
    tagList: tagData,
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
  console.log('mAddNewTagsRes', mAddNewTagsRes.data, robotRemindForConfirmTagRes);
  if (mAddNewTagsRes.data) {
    const mAddNewGameTagsRes = await mAddNewGameTags({
      game_id,
      data: tagData,
    });
  }
  return mAddNewTagsRes;
}
module.exports = {
  sAddNewTags,
};
