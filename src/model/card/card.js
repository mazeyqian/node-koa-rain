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
      // 1激活 2已使用 3已失效
      type: DataTypes.INTEGER,
    },
    card_status: {
      type: DataTypes.INTEGER,
    },
    card_content: {
      type: DataTypes.STRING(500),
    },
    address_id: {
      type: DataTypes.INTEGER,
    },
    crab_id: {
      // 自增 ID
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'mazey_card',
    createdAt: 'create_at',
    updatedAt: 'update_at',
  }
);
async function mGetCardByNumber ({ card_number, card_password }) {
  const ret = await MazeyCard.findOne({
    where: {
      card_number,
      card_password: card_password || '',
    },
    include: [],
    through: { attributes: [] },
  }).catch(console.error);
  if (!ret) {
    return err({ message: '该卡号不存在或者密码错误' });
  }
  return rsp({ data: ret.dataValues });
}
async function mUpdateCard ({ address_id, card_number }) {
  const ret = await MazeyCard.update(
    {
      address_id,
    },
    {
      where: {
        card_number,
      },
    }
  ).catch(console.error);
  if (!ret) {
    return err({ message: '该卡号不存在' });
  }
  return rsp({ data: ret.dataValues });
}
MazeyCard.sync();
module.exports = {
  mGetCardByNumber,
  mUpdateCard,
};
