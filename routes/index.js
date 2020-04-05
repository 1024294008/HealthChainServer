module.exports = function(app){

  // nodemon start

  /* user路由 */
  app.use('/api/user/login', require('./users/login'))
  app.use('/api/user/register', require('./users/register'))
  app.use('/api/user/getUserInfo', require('./users/getUserInfo'))
  app.use('/api/user/updateUserInfo', require('./users/updateUserInfo'))
  app.use('/api/user/getServiceList', require('./users/getMedicalServiceList'))
  app.use('/api/user/getHealthData', require('./users/getHealthData'))
  app.use('/api/user/getBalance', require('./users/getBalance'))
  app.use('/api/user/getHealthCount', require('./users/getHealthCount'))

  /* org路由 */
  app.use('/api/org/login', require('./org/login'))
  app.use('/api/org/register', require('./org/register'))
  app.use('/api/org/audit', require('./org/audit'))
  app.use('/api/org/buyHealthData', require('./org/buyHealthData'))
  app.use('/api/org/delMedicalService', require('./org/delMedicalService'))
  app.use('/api/org/getMedicalServiceList', require('./org/getMedicalServiceList'))
  app.use('/api/org/getMyInfo', require('./org/getMyInfo'))
  app.use('/api/org/insertMedicalService', require('./org/insertMedicalService'))
  app.use('/api/org/updateMedicalService', require('./org/updateMedicalService'))
  app.use('/api/org/updateOrgInfo', require('./org/updateOrgInfo'))
  app.use('/api/org/updatePassword', require('./org/updatePassword'))

  /* admin路由 */
  app.use('/api/admin/login', require('./admin/login'))
  app.use('/api/admin/addAdminInfo', require('./admin/addAdminInfo'))
  app.use('/api/admin/deleteAdmin', require('./admin/deleteAdmin'))
  app.use('/api/admin/updateAdmin', require('./admin/updateAdmin'))
  app.use('/api/admin/getAdminList', require('./admin/getAdminList'))
  app.use('/api/admin/getOrgInfoList', require('./admin/getOrgInfoList'))
  app.use('/api/admin/updateOrgInfo', require('./admin/updateOrgInfo'))
  app.use('/api/admin/delOrgInfo', require('./admin/delOrgInfo'))
  app.use('/api/admin/deleteService', require('./admin/deleteMedicalService'))
  app.use('/api/admin/findMedicalServiceList', require('./admin/findMedicalServiceList'))
  app.use('/api/admin/updateMedicalServcie', require('./admin/updateMedicalServcie'))
  app.use('/api/admin/getLogList', require('./admin/getLogList'))
  app.use('/api/admin/getUserList', require('./admin/getUserList'))
  app.use('/api/admin/findUserInfo', require('./admin/findUserInfo'))
  app.use('/api/admin/updateUserInfo', require('./admin/updateUserInfo'))
  app.use('/api/admin/deleteUser', require('./admin/deleteUser'))
  app.use('/api/admin/getWalletInfo', require('./admin/getWalletInfo'))
  app.use('/api/admin/isSuperAdmin', require('./admin/isSuperAdmin'))
  /* common路由 */
  app.use('/api/common/getOrgInfo', require('./common/getOrgInfo'))
  app.use('/api/common/getMedicalServiceInfo', require('./common/getMedicalServiceInfo'))
  app.use('/api/common/transfer', require('./common/transfer'))
  app.use('/api/common/getServiceAndOrg', require('./common/getServiceAndOrg'))
  app.use('/api/common/uploadOrgHealthData', require('./common/uploadOrgHealthData'))
  app.use('/api/common/uploadUserHealthData', require('./common/uploadUserHealthData'))
}
