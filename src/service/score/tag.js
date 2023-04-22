const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { mAddNewTags } = require('../../model/tag');
const { mAddNewGameTags } = require('../../model/game');
const { sRobotRemindForCommonTag } = require('../../service/robot/robot');
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
    alias: 'communityFEServerErrorUrl',
    tags: ['社区报错', '4563333333'],
    contents: [
      {
        name: 'host',
        value: '2333222221223334111',
      },
      {
        name: 'url',
        value: '2333222',
      },
      {
        name: 'env',
        value: '2222',
      },
    ],
  };
  console.log('mAddNewTagsRes', mAddNewTagsRes.data);
  const RobotRemindForCommonTagRes = await sRobotRemindForCommonTag({ ...params });
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
