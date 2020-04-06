var express = require('express')
var router = express.Router()

var service = require('../../service')

var dao = require('../../dao')

var checktoken = require('../../middleware/checkToken')

router.post('/', checktoken, function(req, res, next){
  service.adminService.transactionRecordByType(req, function(result){
    res.json(result)
  })
})

module.exports = router
