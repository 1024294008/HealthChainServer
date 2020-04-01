var express = require('express')
var router = express.Router()

var service = require('../../service')
var checkToken = require('../../middleware/checkToken')

router.get('/', function(req, res, next){
  service.userService.getMedicalServiceList(req, function(result){
    res.json(result)
  })
})

module.exports = router
