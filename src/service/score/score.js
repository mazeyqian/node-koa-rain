const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { addNewScore } = require('../../model/score');
const { queryUpdateGame } = require('../../model/game');
const { jwtVerify } = require('../../entities/jwt');
// 增加游戏评分 (评分的时候需要对游戏表的分数进行处理)
async function sAddNewScore (ctx, { game_id, score, start, remark }) {
  if (!game_id) {
    return err({ message: '缺少游戏' });
  }
  let userToken = ctx.request.header.usertoken;
  let jwtToken = jwtVerify(userToken);
  console.log('userToken', userToken, jwtToken);
  if (jwtToken.code !== 2) {
    return rsp({
      message: '用户登陆过期,请重新登陆',
      data: {},
    });
  }
  const queryGameRes = await queryUpdateGame({ game_id });
  console.log('queryGameRes', queryGameRes);
  if (queryGameRes.data) {
    const addNewGameRes = await addNewScore({
      game_id,
      game_name: queryGameRes.data.game_name,
      score,
      start,
      remark,
      user_id: jwtToken.data.user_id,
      user_name: jwtToken.data.user_name,
    });
    return addNewGameRes;
  } else {
    return queryGameRes;
  }
}
module.exports = {
  sAddNewScore,
};
