const { sqlIns } = require('../entities/orm');
const { DataTypes } = require('sequelize');
const { rsp } = require('../entities/response');
const { err } = require('../entities/error');

const MazeyGame = sqlIns.define(
  'MazeyGame',
  {
    game_id: {
      // 自增 ID
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    game_picture: {
      type: DataTypes.STRING(200),
    },
    game_star: {
      type: DataTypes.FLOAT,
    },
    game_type: {
      // 游戏的类型
      type: DataTypes.STRING(50),
    },
    game_name: {
      type: DataTypes.STRING(50),
    },
    game_english_name: {
      type: DataTypes.STRING(50),
    },
    game_content: {
      // 游戏内容
      type: DataTypes.STRING(500),
    },
    game_score: {
      type: DataTypes.FLOAT,
    },
    game_score_personnel: {
      type: DataTypes.INTEGER,
    },
    // 发行商
    game_publisher: {
      type: DataTypes.STRING(50),
    },
    // 发版时间
    game_release_time: {
      type: DataTypes.STRING(50),
    },
    // 操作人
    user_id: {
      type: DataTypes.INTEGER,
    },
    user_name: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: 'mazey_game',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
// 增加一个游戏
async function addNewGame ({ game_picture, game_type, game_name, game_english_name, game_content, game_publisher = '', game_release_time = '', user_id, user_name }) {
  const ret = await MazeyGame.create({
    game_picture,
    game_type,
    game_name,
    game_english_name,
    game_content,
    game_publisher,
    game_release_time,
    user_id,
    user_name,
  }).catch(console.error);
  if (ret && ret.dataValues) {
    return rsp({ data: ret.dataValues });
  }
  return err();
}
// 获取游戏信息并且更新
async function queryUpdateGame ({ game_id }) {
  const ret = await MazeyGame.findOne({
    where: {
      game_id,
    },
  }).catch(console.error);
  if (!ret) {
    return err({ message: '该游戏不存在' });
  }
  return rsp({ data: ret.dataValues });
}
async function mUpdateGame ({ data }, score) {
  console.log('data', data, score);
  const scoreData = score.data;
  let game_score_personnel = data.game_score_personnel + 1;
  let game_score = (data.game_score * data.game_score_personnel + scoreData.score) / game_score_personnel;
  game_score = game_score.toFixed(1);
  let game_star = 5;
  let game_id = data.game_id;
  const ret = await MazeyGame.update(
    {
      game_score,
      game_star,
      game_score_personnel,
    },
    {
      where: {
        game_id,
      },
    }
  ).catch(console.error);
  if (!ret) {
    return err({ message: '该游戏不存在' });
  }
  return rsp({ data: ret.dataValues });
}
// 查询所有游戏
async function queryAllGame () {
  const ret = await MazeyGame.findAll().catch(console.error);
  console.log('ret', ret);
  return rsp({ data: ret });
}
MazeyGame.sync();

module.exports = {
  addNewGame,
  queryUpdateGame,
  queryAllGame,
  mUpdateGame,
};
