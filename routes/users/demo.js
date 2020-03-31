var express = require('express')
var createToken = require('../../middleware/createToken')
var checkToken = require('../../middleware/checkToken')
var router = express.Router()

var adminDao = require('../../dao/adminDao')

router.get('/', function(req, res, next){
  // 获取get数据  req.query
  // 获取post数据 req.body
  // 返回json数据 res.json({"account": ""})
  // var token = createToken({"id": 2, "type": "admin"}) // 根据指定数据创建token

  var params = {
    "authority": "root",
    "limit": 2,
    "page": 1
  }

  // adminDao.findByConditionsCount(params, function(status, result){
  //   res.json(result)
  // })

  // adminDao.findByConditions(params, function(status, result){
  //   res.json(result)
  // })

  // adminDao.deleteByPrimaryKey({"id": 8}, function(status, result){
  //   res.json(result);
  // })

})

// 解析token
// router.post('/aa', checkToken, function(req, res, next){
//   admin = req.body.verify
// })

module.exports = router
