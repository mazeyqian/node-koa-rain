const { sqlIns } = require('../common/orm');
const { DataTypes } = require('sequelize');
const { rsp } = require('../entities/response');
const { err } = require('../entities/error');
const { isNumber } = require('mazey');

const MazeyCode = sqlIns.define(
  'MazeyCode',
  {
    code_id: {
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
      // 姓名
      type: DataTypes.STRING(20),
    },
    code_type: {
      // 验证码类型
      type: DataTypes.STRING(20),
    },
    verify_status: {
      // 校验状态0,1,2 0未校验 1校验完成 2校验中
      type: DataTypes.STRING(20),
    },
    content: {
      // code内容
      type: DataTypes.STRING(10),
    },
  },
  {
    tableName: 'mazey_code',
    createdAt: 'create_at',
    updatedAt: false,
  }
);

MazeyCode.sync();
// 查看内容是否存在
async function mIsExistContent ({ content }) {
  const cRes = await MazeyCode.count({
    where: {
      content,
    },
  }).catch(console.error);
  if (!isNumber(cRes)) {
    return err();
  }
  if (cRes === 0) {
    return rsp({ message: '不存在', data: { isExist: false } });
  }
  return rsp({ message: '存在', data: { isExist: true } });
}

module.exports = {
  mIsExistContent,
};
