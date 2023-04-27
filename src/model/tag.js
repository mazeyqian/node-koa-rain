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
    user_name: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: 'mazey_tag',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
// 增加标签
async function mAddNewTags ({ user_id, user_name, tag_name }) {
  // 创建前先看标签是否存在
  const tags = await Promise.all(
    tag_name.map(name => {
      return MazeyTag.findOrCreate({
        where: { tag_name: name },
        defaults: {
          user_name: user_name || '系统',
          user_id: user_id || 1,
        },
      });
    })
  );
  // const ret = await MazeyTag.bulkCreate(param, {
  //   updateOnDuplicate: ['tag_name'],
  // });
  return rsp({ data: tags });
}
// 查询已有标签
async function mQueryOldTags ({ tag_name }) {
  let tags = await MazeyTag.findAll({
    where: {
      tag_name: tag_name,
    },
  });
  return rsp({ data: tags });
}
MazeyTag.sync();
module.exports = {
  MazeyTag,
  mAddNewTags,
  mQueryOldTags,
};
