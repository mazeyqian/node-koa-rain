// 卡号 密码 状态(0, 1)
const { sqlIns } = require('../../entities/orm');
const { DataTypes } = require('sequelize');
const { rsp, rspPage } = require('../../entities/response');
const { err } = require('../../entities/error');
const MazeyAddress = sqlIns.define(
  'MazeyAddress',
  {
    address_id: {
      // 自增 ID
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address_province: {
      type: DataTypes.INTEGER,
    },
    address_city: {
      type: DataTypes.INTEGER,
    },
    address_district: {
      type: DataTypes.INTEGER,
    },
    address_detail: {
      type: DataTypes.STRING(200),
    },
    address_content: {
      type: DataTypes.STRING(500),
    },
    address_user: {
      type: DataTypes.STRING(50),
    },
    address_mobile: {
      type: DataTypes.STRING(50),
    },
    address_number: {
      type: DataTypes.STRING(50),
    },
    address_category: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: 'mazey_address',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
async function mAddAddressByNumber ({ card_number, address_detail, address_user, address_mobile }) {
  const ret = await MazeyAddress.create({
    address_detail,
    address_user,
    address_mobile,
  }).catch(console.error);
  if (ret && ret.dataValues) {
    return rsp({ data: ret.dataValues });
  }
  return err();
}
MazeyAddress.sync();
module.exports = {
  mAddAddressByNumber,
};
