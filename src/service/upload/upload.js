// 1.引入
const multer = require('multer');
const path = require('path');
const { time } = require('../../utils/time');
// 设置保存路径和文件名
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    // 设置文件存储路径
    cb(null, '../../files');
  },
  filename: function (req, file, cb) {
    // 设置文件名（可以自己定义）判断是否有特殊字符
    let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~!@#￥……&*()——|{}【】‘;:”“'。,、? ]");
    let fileName = file.originalname;
    if (pattern.test(fileName)) {
      // 有特殊字符就重新起名字
      let rs = '';
      for (let i = 0; i < fileName.length; i++) {
        rs += this.substr(i, 1).replace(pattern, '');
      }
      fileName = rs;
    }
    let fileData = time(Date.now()) + '-' + Math.round(Math.random() * 1e9) + path.extname(fileName);
    cb(null, fileName + '-' + fileData);
  },
});
const uploadFile = multer({
  storage,
});
// 导出router
module.exports = {
  uploadFile,
};
