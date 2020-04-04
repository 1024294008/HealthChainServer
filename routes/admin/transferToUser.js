var express = require('express')
var router = express.Router()

var service = require('../../service')

var dao = require('../../dao')

router.post('/', function(req, res, next){
  service.adminService.transfer(req, function(result){
    res.json(result)
  })
})

module.exports = router
