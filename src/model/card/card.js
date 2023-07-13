// 卡号 密码 状态(0, 1)
const { sqlIns } = require('../../entities/orm');
const { DataTypes } = require('sequelize');
const { rsp, rspPage } = require('../../entities/response');
const { err } = require('../../entities/error');
const MazeyCard = sqlIns.define(
  'MazeyCard',
  {
    card_id: {
      // 自增 ID
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    card_number: {
      type: DataTypes.STRING(200),
    },
    card_password: {
      type: DataTypes.STRING(50),
    },
    card_type: {
      type: DataTypes.INTEGER,
    },
    card_status: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'mazey_card',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
MazeyCard.sync();
module.exports = {};
