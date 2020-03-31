/* dao入口文件 */

var adminDao = require('./adminDao')
var logDao = require('./logDao')
var user_healthdataDao = require('./user_healthdataDao')
var transactionrecordDao = require('./transactionrecordDao')
var userDao= require('./userDao')
var medicalServiceDao = require('./medicalServiceDao')
var orgDao = require('./orgDao')
// var visitorrecordDao = require('./visitorrecordDao')

exports.adminDao = adminDao
exports.logDao = logDao
exports.user_healthdataDao = user_healthdataDao
exports.transactionrecordDao = transactionrecordDao
exports.userDao = userDao
exports.medicalServiceDao = medicalServiceDao
exports.orgDao = orgDao
// exports.visitorrecordDao = visitorrecordDao
