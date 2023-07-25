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
      // 快递单号
      type: DataTypes.STRING(50),
    },
    address_category: {
      type: DataTypes.STRING(50),
    },
    address_date: {
      type: DataTypes.STRING(50),
    },
    // 存一下卡号
    card_number: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'mazey_address',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
async function mGetAddressByNumber ({ card_number }) {
  const ret = await MazeyAddress.findOne({
    where: {
      card_number,
    },
    through: { attributes: [] },
  }).catch(console.error);
  if (!ret) {
    return err({ message: '该卡号没有地址' });
  }
  return rsp({ data: ret.dataValues });
}
async function mAddAddressByNumber ({ card_number, address_detail, address_user, address_mobile, address_date }) {
  const ret = await MazeyAddress.create({
    card_number,
    address_detail,
    address_user,
    address_mobile,
    address_date,
  }).catch(console.error);
  if (ret && ret.dataValues) {
    return rsp({ data: ret.dataValues });
  }
  return err();
}
// 修改地址或者填写单号
async function mUpdateAddress ({ card_number, address_id, address_detail, address_user, address_mobile, address_date, address_number }) {
  let ret = '';
  if (address_number) {
    ret = await MazeyAddress.update(
      {
        address_number,
      },
      {
        where: {
          address_id,
        },
      }
    ).catch(console.error);
    if (!ret) {
      return err({ message: '该卡号不存在' });
    }
    return rsp({ data: ret.dataValues });
  } else {
    const ret = await MazeyAddress.update(
      {
        address_detail,
        address_user,
        address_mobile,
        address_date,
      },
      {
        where: {
          address_id,
        },
      }
    ).catch(console.error);
    if (ret && ret.dataValues) {
      return rsp({ data: ret.dataValues });
    }
    return err();
  }
}

MazeyAddress.sync();
module.exports = {
  MazeyAddress,
  mGetAddressByNumber,
  mAddAddressByNumber,
  mUpdateAddress,
};
