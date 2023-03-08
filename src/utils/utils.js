'use strict';

// 检查手机格式
function checkPhone (phone) {
  return /^1[3456789]\d{9}$/.test(phone);
}

function convert26 (num) {
  return (num <= 26 ? String.fromCharCode(num + 64) : convert26(~~((num - 1) / 26)) + convert26(num % 26 || 26)).toLowerCase();
}

// 书名
function genBookName (bookName) {
  if (bookName.includes('《')) {
    return bookName;
  }
  return `《${bookName}》`;
}

// 空内容
function isEmptyContent (content) {
  if (['', null, 'null', 'NULL', 'Null'].includes(content)) {
    return true;
  }
  return false;
}

module.exports = {
  checkPhone,
  convert26,
  genBookName,
  isEmptyContent,
};
