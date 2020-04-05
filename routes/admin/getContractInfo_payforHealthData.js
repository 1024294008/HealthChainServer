var express = require('express')
var router = express.Router()

var service = require('../../service')

router.get('/', function(req, res, next){
  console.log("准备查找合约参数...")
  service.adminService.getContractInfo_payforHealthData(req, function(result){
    res.json(result)
  })
})

module.exports = router
