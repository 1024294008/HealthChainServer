var express = require('express')
var router = express.Router()

var service = require('../../service')
var checkToken = require('../../middleware/checkToken')

router.post('/', checkToken, function(req, res, next){
  service.commonService.uploadUserHealthData(req, function(result){
    res.json(result)
  })
})

module.exports = router
