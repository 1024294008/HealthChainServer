/**
 * 验证token
 */
var tokenSecret = require('../config/tokenSecret').secret
var jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
  var token = req.body.token
  if(token){
    var verify = jwt.verify(token, tokenSecret)
    req.body.verify = verify.name
    next()
    return
  }else{
    res.json({
      _code: '401',
      _msg: '未授权',
      _data: {}
    })
  }
}
