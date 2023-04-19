const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { mAddNewTags } = require('../../model/tag');
const { mAddNewGameTags } = require('../../model/game');
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
  console.log('mAddNewTagsRes', mAddNewTagsRes.data);
  if (mAddNewTagsRes.data) {
    const mAddNewGameTagsRes = await mAddNewGameTags({
      game_id,
      data: mAddNewTagsRes.data,
    });
  }
  return mAddNewTagsRes;
}
module.exports = {
  sAddNewTags,
};
