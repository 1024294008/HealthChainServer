/**
 * 验证token
 */
var tokenSecret = require('../config/tokenSecret').secret
var jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
  var token = req.body.token
  if(token){
    var verify = jwt.verify(token, tokenSecret)
    req.body.verify = verify
    next()
    return
  }else{
    res.json({
      code: 401,
      msg: '未授权'
    })
  }
}
