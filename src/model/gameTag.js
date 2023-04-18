const { sqlIns } = require('../entities/orm');
const { DataTypes } = require('sequelize');
const { rsp } = require('../entities/response');
const { err } = require('../entities/error');
const MazeyGameTag = sqlIns.define('MazeyGameTag', {});
MazeyGameTag.sync();
module.exports = {
  MazeyGameTag,
};
