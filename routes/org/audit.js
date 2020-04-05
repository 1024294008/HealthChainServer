var express = require('express')
var router = express.Router()
var service = require('../../service')
var checkToken = require('../../middleware/checkToken')

var filePath = require('../../config/filePath')
var fs = require('fs');
var multer  = require('multer');
var fileName;
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, filePath.filePath);
        // cb(null, 'F:/Zink/');
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
});

// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

var uploadFolder = filePath.filePath;
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });

router.post('/',upload.single('file'), checkToken,function(req, res, next){
  req.body.fileName = fileName;
  service.orgService.audit(req, function(result){
    res.json(result)
  })
})

router.get('/download', function(req, res, next) {

  let file_name = req.query.file
  res.download(filePath.filePath + file_name)

  })

module.exports = router
