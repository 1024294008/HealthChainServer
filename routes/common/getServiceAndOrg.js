var express = require('express')
var router = express.Router()

var service = require('../../service')

router.get('/', function(req, res, next){
  service.commonService.getServiceAndOrg(req, function(result){
    res.json(result)
  })
})

module.exports = router
