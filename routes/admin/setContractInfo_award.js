
var express = require('express')
var router = express.Router()

var service = require('../../service')

var checktoken = require('../../middleware/checkToken')

router.post('/', checktoken, function(req, res, next){
  console.log("修改奖励。。")
  service.adminService.setContractInfo_award(req, function(result){
    res.json(result);
  })
})

module.exports = router
