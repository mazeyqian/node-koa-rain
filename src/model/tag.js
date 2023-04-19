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
      unique: true,
    },
    tag_description: {
      type: DataTypes.STRING(200),
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'mazey_tag',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
// 查询所有游戏
async function mAddNewTags ({ game_id, tag_name }) {
  let param = tag_name;
  const ret = await MazeyTag.bulkCreate(param, {
    updateOnDuplicate: ['tag_name'],
  });
  console.log('ret', ret);
  return rsp({ data: [] });
}
MazeyTag.sync();
module.exports = {
  MazeyTag,
  mAddNewTags,
};
