const { sqlIns } = require('../entities/orm');
const { DataTypes, Op } = require('sequelize');
const { rsp } = require('../entities/response');
const { err } = require('../entities/error');
const { isNumber } = require('mazey');

const MazeyScore = sqlIns.define(
  'MazeyScore',
  {
    score_id: {
      // 自增 ID
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      // 用户 ID
      type: DataTypes.INTEGER,
    },
    user_name: {
      type: DataTypes.STRING(20),
    },
    game_id: {
      // 游戏id
      type: DataTypes.INTEGER,
    },
    game_name: {
      type: DataTypes.STRING(50),
    },
    score: {
      // 评分1-10分
      type: DataTypes.INTEGER,
    },
    remark: {
      // 备注
      type: DataTypes.STRING(300),
    },
  },
  {
    tableName: 'mazey_score',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);

MazeyScore.sync();

module.exports = {};
