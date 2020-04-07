var express = require('express')
var router = express.Router()

var service = require('../../service')
var checkToken = require('../../middleware/checkToken')

router.post('/', checkToken, function(req, res, next){
  service.userService.getHealthDataList(req, function(result){
    console.log(result)
    res.render('distanceChart', {healthDataList: result._data});
  })
})

module.exports = router
