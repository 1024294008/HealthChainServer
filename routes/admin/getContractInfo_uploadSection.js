var express = require('express')
var router = express.Router()

var service = require('../../service')

router.get('/', function(req, res, next){
  console.log("开始执行获取合约参数的请求")
  service.adminService.getContractInfo_uploadSection(req, function(result){
    res.json(result)
  })
})

module.exports = router
