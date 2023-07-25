const fs = require('fs');
const path = require('path');
const { rsp, err } = require('../../entities/response');
const ExcelJS = require('exceljs');
const { mGetCardByNumber, mUpdateCard, mUpdateCardByAddress, mCheckCardByNumber } = require('../../model/card/card');
const { mAddAddressByNumber, mUpdateAddress, mGetAddressByNumber } = require('../../model/card/address');
const { sRobotRemindCardAddress } = require('../robot/robot');
const Joi = require('joi');
async function sUploadCard (ctx) {
  const file = ctx.request.files.file; // 获取上传文件
  const filePath = file.path;
  // 创建一个新的工作簿对象
  const workbook = new ExcelJS.Workbook();
  // 读取Excel文件
  await workbook.xlsx.readFile(filePath);
  // 获取第一个工作表
  const worksheet = workbook.worksheets[0];
  // 存储数据的数组
  const data = [];
  // 遍历行
  worksheet.eachRow((row, rowNumber) => {
    // 获取每一行的单元格数据
    const rowData = [];
    row.eachCell((cell, colNumber) => {
      rowData.push(cell);
    });
    // 将每一行的数据存储到数组中
    data.push(rowData);
  });
  console.log('data', data);
}
async function sGetCardByNumber ({ card_number, card_password }) {
  const schema = Joi.object({
    card_number: Joi.string()
      .required()
      .error(new Error('请输入卡号')),
    card_password: Joi.string()
      .required()
      .error(new Error('请输入密码')),
  });
  const { error } = schema.validate({
    card_number,
    card_password,
  });
  if (error) {
    return err({ message: error.message });
  }
  const mGetCardByNumberRes = await mGetCardByNumber({ card_number, card_password });
  return mGetCardByNumberRes;
}
async function sGetCrabByNumber ({ card_number }) {
  const schema = Joi.object({
    card_number: Joi.string()
      .required()
      .error(new Error('请输入卡号')),
  });
  const { error } = schema.validate({
    card_number,
  });
  if (error) {
    return err({ message: error.message });
  }
  const mGetCrabByNumberRes = await mCheckCardByNumber({ card_number });
  return mGetCrabByNumberRes;
}
async function sAddAddressByNumber ({ card_number, address_detail, address_user, address_mobile, address_date }) {
  const schema = Joi.object({
    card_number: Joi.string()
      .required()
      .error(new Error('请输入卡号')),
    address_detail: Joi.string()
      .required()
      .error(new Error('请输入详细地址')),
    address_user: Joi.string()
      .required()
      .error(new Error('请输入收货人姓名')),
    address_mobile: Joi.string()
      .required()
      .error(new Error('请输入收货人手机号')),
    address_date: Joi.string()
      .required()
      .error(new Error('请选择发货日期')),
  });
  const { error } = schema.validate({
    card_number,
  });
  if (error) {
    return err({ message: error.message });
  }
  const mGetCrabByNumberRes = await mGetCardByNumber({ card_number });
  if (mGetCrabByNumberRes) {
    if (mGetCrabByNumberRes.address_id) {
      return err({ message: '该卡已使用' });
    }
    const mAddAddressByNumberRes = await mAddAddressByNumber({ card_number, address_detail, address_user, address_mobile, address_date });
    if (mAddAddressByNumberRes) {
      const mUpdateCardRes = await mUpdateCard({ card_number, address_id: mAddAddressByNumberRes.data.address_id });
      await sRobotRemindCardAddress({ card_number, address_detail, address_user, address_mobile, address_date });
      return mUpdateCardRes;
    }
  }
  return err({ message: '失败' });
}
async function sUpdateCardByAddressNumber ({ address_id, address_number }) {
  // 填入单号的同时修改卡为已使用
  await mUpdateAddress({ address_id, address_number });
  const sUpdateCardByAddressRes = await mUpdateCardByAddress({ address_id });
  return sUpdateCardByAddressRes;
}
async function sGetAddressByNumber ({ card_number }) {
  // 根据卡号获取
  const mGetAddressByNumberRes = await mGetAddressByNumber({ card_number });
  return mGetAddressByNumberRes;
}

module.exports = {
  sUploadCard,
  sGetCardByNumber,
  sGetCrabByNumber,
  sAddAddressByNumber,
  sUpdateCardByAddressNumber,
  sGetAddressByNumber,
};
