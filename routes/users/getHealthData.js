var express = require('express')
var router = express.Router()

var service = require('../../service')
var checkToken = require('../../middleware/checkToken')

router.post('/', checkToken, function(req, res, next){
  console.log(req.body)
  service.userService.getHealthData(req, function(result){
    res.json(result)
  })
})

module.exports = router
