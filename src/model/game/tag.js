const { sqlIns } = require('../../entities/orm');
const { DataTypes } = require('sequelize');
const { rsp } = require('../../entities/response');
const { err } = require('../../entities/error');
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
    indexes: [{ fields: ['tag_name'] }],
  }
);
// 查询所有游戏
async function mAddNewTags ({ user_id, user_name, game_id, tag_name }) {
  console.log('tag_name', tag_name);
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
  console.log('tags', tags);
  return rsp({ data: tags });
}
MazeyTag.sync();
module.exports = {
  MazeyTag,
  mAddNewTags,
};
