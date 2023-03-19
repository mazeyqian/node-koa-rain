const { sqlIns } = require('../entities/orm');
const { DataTypes, Op } = require('sequelize');
const { rsp } = require('../entities/response');
const { err } = require('../entities/error');
const { isNumber } = require('mazey');

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
      type: DataTypes.STRING(50),
    },
    game_star: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
    },
    game_score_personnel: {
      type: DataTypes.INTEGER,
    },
    game_publisher: {
      type: DataTypes.STRING(50),
    },
    game_release_time: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: 'mazey_game',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);

MazeyGame.sync();

module.exports = {};
