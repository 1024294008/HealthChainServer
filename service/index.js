/* service入口文件 */

var adminService = require('./adminService')
var userService = require('./userService')
var orgService= require('./orgService')
var commonService = require('./commonService')

exports.adminService = adminService
exports.userService = userService
exports.orgService = orgService
exports.commonService = commonService
