const fs = require('fs');
const path = require('path');
const { rsp, ossRsp } = require('../../entities/response');
const ExcelJS = require('exceljs');
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
      rowData.push(cell.value);
    });
    // 将每一行的数据存储到数组中
    data.push(rowData);
  });
  console.log('data', data);
}
module.exports = {
  sUploadCard,
};
