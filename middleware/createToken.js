/**
 * 生成token
 */
var tokenSecret = require('../config/tokenSecret').secret
var jwt = require('jsonwebtoken')

module.exports = function(payload){
  // 设置过期时间
  // var expiry = new Date()
  // expiry.setDate(expiry.getHours + 1)

  var token = jwt.sign({
    name: payload,
    // exp: parseInt(expiry.getTime()/1000)
  }, tokenSecret)

  return token
}
