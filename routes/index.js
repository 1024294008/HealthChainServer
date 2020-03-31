module.exports = function(app){

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

  /* common路由 */

}
