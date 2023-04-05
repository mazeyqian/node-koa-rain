const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { addNewGame } = require('../../model/game');
const axios = require('axios');
const { jwtVerify } = require('../../entities/jwt');
// 增加游戏
async function sAddNewGame (ctx, { game_name, game_english_name, game_type, game_picture, game_content, game_publisher = '', game_release_time = '' }) {
  if (!game_name) {
    return err({ message: '缺少游戏名称' });
  }
  let userToken = ctx.request.header.usertoken;
  let jwtToken = jwtVerify(userToken);
  if (jwtToken.code !== 2) {
    return rsp({
      message: '用户登陆过期,请重新登陆',
      data: {},
    });
  }
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
module.exports = {
  sAddNewGame,
};
