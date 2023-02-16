// 1.引入
const multer = require('multer');
const path = require('path');

// 设置保存路径和文件名
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    // 设置文件存储路径
    cb(null, '../../../files');
  },
  filename: function (req, file, cb) {
    // 设置文件名（可以自己定义）
    let fileData = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + fileData);
  },
});
const uploadFile = multer({
  storage,
});
// 导出router
module.exports = {
  uploadFile,
};
