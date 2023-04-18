const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { addNewGame, queryAllGame } = require('../../model/game');
const axios = require('axios');
const Joi = require('joi');
// 增加游戏
async function sAddNewGame (ctx, { game_name, game_english_name, game_type, game_picture, game_content, game_publisher = '', game_release_time = '' }) {
  const schema = Joi.object({
    game_name: Joi.string()
      .required()
      .error(new Error('请输入游戏名称')),
    game_type: Joi.string()
      .required()
      .error(new Error('请选择游戏类型')),
  });
  const { error } = schema.validate({
    game_name,
    game_type,
  });
  if (error) {
    return err({ message: error.message });
  }
  const jwtToken = ctx.state.user;
  const addNewGameRes = await addNewGame({
    game_picture,
    game_type,
    game_name,
    game_english_name,
    game_content,
    game_publisher,
    game_release_time,
    user_id: jwtToken.data.user_id,
    user_name: jwtToken.data.user_name,
  });
  return addNewGameRes;
}
// 查询所有游戏
async function sQueryAllGame (ctx) {
  const queryAllGameRes = await queryAllGame();
  return queryAllGameRes;
}
module.exports = {
  sAddNewGame,
  sQueryAllGame,
};
