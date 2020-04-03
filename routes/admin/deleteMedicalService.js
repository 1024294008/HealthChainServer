
var express = require('express')
var router = express.Router()

var service = require('../../service')

var checktoken = require('../../middleware/checkToken')

router.post('/', checktoken, function(req, res, next){
  console.log("删除删除删除....")
  service.adminService.deleteMedicalService(req, function(result){
    res.json(result);
  })
})

module.exports = router
