module.exports = function(app){

  // nodemon start

  /* user路由 */
  app.use('/api/user/login', require('./users/login'))
  app.use('/api/user/register', require('./users/register'))
  app.use('/api/user/getUserInfo', require('./users/getUserInfo'))

  /* org路由 */
  app.use('/api/org/login', require('./org/login'))

  /* admin路由 */
  app.use('/api/admin/login', require('./admin/login'))
  app.use('/api/admin/addAdminInfo', require('./admin/addAdminInfo'))
  app.use('/api/admin/deleteAdmin', require('./admin/deleteAdmin'))
  app.use('/api/admin/updateAdmin', require('./admin/updateAdmin'))
  app.use('/api/admin/getAdminList', require('./admin/getAdminList'))

  /* common路由 */

}
