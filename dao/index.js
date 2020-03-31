/* dao入口文件 */

var adminDao = require('./adminDao')
var logDao = require('./logDao')
var user_healthdataDao = require('./user_healthdataDao')
var userDao= require('./userDao')

exports.adminDao = adminDao
exports.logDao = logDao
exports.user_healthdataDao = user_healthdataDao
exports.userDao = userDao
