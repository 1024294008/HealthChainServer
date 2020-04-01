module.exports = function(app){

  /* user路由 */
  app.use('/api/user/login', require('./users/login'))
  app.use('/api/user/register', require('./users/register'))
  app.use('/api/user/getUserInfo', require('./users/getUserInfo'))

  /* org路由 */
  app.use('/api/org/login', require('./org/login'))

  /* admin路由 */
  app.use('/api/admin/login', require('./admin/login'))

  /* common路由 */
  app.use('/api/common/getOrgInfo', require('./common/getOrgInfo'))
  app.use('/api/common/getMedicalServiceInfo', require('./common/getMedicalServiceInfo'))
  app.use('/api/common/transfer', require('./common/transfer'))
}
