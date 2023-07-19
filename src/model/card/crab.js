// 卡号 密码 状态(0, 1)
const { sqlIns } = require('../../entities/orm');
const { DataTypes } = require('sequelize');
const { rsp, rspPage } = require('../../entities/response');
const { err } = require('../../entities/error');
const MazeyCrab = sqlIns.define(
  'MazeyCrab',
  {
    crab_id: {
      // 自增 ID
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    crab_specification: {
      type: DataTypes.STRING(100),
    },
    crab_weight: {
      type: DataTypes.INTEGER,
    },
    crab_content: {
      type: DataTypes.STRING(500),
    },
  },
  {
    tableName: 'mazey_crab',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
MazeyCrab.sync();
module.exports = {};
