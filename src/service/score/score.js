const { err } = require('../../entities/err');
const { rsp } = require('../../entities/response');
const { addNewScore, queryAllScore } = require('../../model/score');
const { queryUpdateGame } = require('../../model/game');
// 增加游戏评分 (评分的时候需要对游戏表的分数进行处理)
async function sAddNewScore (ctx, { game_id, score, start, remark }) {
  if (!game_id) {
    return err({ message: '缺少游戏' });
  }
  const jwtToken = ctx.state.user;
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
// 查询所有游戏
async function sQueryAllScore (ctx, { game_id }) {
  const queryAllScoreRes = await queryAllScore({ game_id });
  return queryAllScoreRes;
}
module.exports = {
  sAddNewScore,
  sQueryAllScore,
};
