const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { addNewGame, queryAllGame } = require('../../model/game');
const axios = require('axios');
// 增加游戏
async function sAddNewGame (ctx, { game_name, game_english_name, game_type, game_picture, game_content, game_publisher = '', game_release_time = '' }) {
  if (!game_name) {
    return err({ message: '缺少游戏名称' });
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
