const { sqlIns } = require('../entities/orm');
const { DataTypes } = require('sequelize');
const { rsp } = require('../entities/response');
const { err } = require('../entities/error');
const MazeyTag = sqlIns.define(
  'MazeyTag',
  {
    tag_id: {
      // 自增 ID
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_name: {
      type: DataTypes.STRING(200),
    },
    tag_description: {
      type: DataTypes.STRING(200),
    },
  },
  {
    tableName: 'mazey_tag',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
MazeyTag.sync();
module.exports = {
  MazeyTag,
};
