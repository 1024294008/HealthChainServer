module.exports = function(app){

  // nodemon start

  /* user路由 */
  app.use('/api/user/login', require('./users/login'))
  app.use('/api/user/register', require('./users/register'))
  app.use('/api/user/getUserInfo', require('./users/getUserInfo'))
  app.use('/api/user/updateUserInfo', require('./users/updateUserInfo'))
  app.use('/api/user/getMedicalServiceList', require('./users/getMedicalServiceList'))
  app.use('/api/user/getHealthData', require('./users/getHealthData'))

  /* org路由 */
  app.use('/api/org/login', require('./org/login'))

  /* admin路由 */
  app.use('/api/admin/login', require('./admin/login'))
  app.use('/api/admin/addAdminInfo', require('./admin/addAdminInfo'))
  app.use('/api/admin/deleteAdmin', require('./admin/deleteAdmin'))
  app.use('/api/admin/updateAdmin', require('./admin/updateAdmin'))
  app.use('/api/admin/getAdminList', require('./admin/getAdminList'))
  app.use('/api/admin/getOrgInfoList', require('./admin/getOrgInfoList'))
  app.use('/api/admin/updateOrgInfo', require('./admin/updateOrgInfo'))
  app.use('/api/admin/delOrgInfo', require('./admin/delOrgInfo'))
  app.use('/api/admin/findMedicalServiceList', require('./admin/findMedicalServiceList'))
  app.use('/api/admin/updateMedicalServcie', require('./admin/updateMedicalServcie'))
  app.use('/api/admin/getLogList', require('./admin/getLogList'))

  /* common路由 */
  app.use('/api/common/getOrgInfo', require('./common/getOrgInfo'))
  app.use('/api/common/getMedicalServiceInfo', require('./common/getMedicalServiceInfo'))
  app.use('/api/common/transfer', require('./common/transfer'))
}
