const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { mAddNewTags } = require('../../model/tag');
const Joi = require('joi');
// 批量增加标签,主要判重
async function sAddNewTags (ctx, { game_id, tag_name }) {
  const schema = Joi.object({
    game_id: Joi.number()
      .integer()
      .required()
      .error(new Error('请选择游戏')),
    tag_name: Joi.string()
      .required()
      .max(10)
      .error(new Error('游戏标签最多10')),
  });
  const { error } = schema.validate({
    game_id,
    tag_name,
  });
  if (error) {
    return err({ message: error.message });
  }
  const jwtToken = ctx.state.user;
  const mAddNewTagsRes = await mAddNewTags({
    game_id,
    tag_name,
  });
  console.log('mAddNewTagsRes', mAddNewTagsRes);
  return mAddNewTagsRes;
}
module.exports = {
  sAddNewTags,
};
