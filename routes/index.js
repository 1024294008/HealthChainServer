module.exports = function(app){

  // localhost:3000/api/user/login

  /* user路由 */
  app.use('/api/user/login', require('./users/login'))
  // app.use('/api/user/register', require('./users/register'))

  /* org路由 */
  // app.use('/api/org/login', require('./org/login'))

  /* admin路由 */
  // app.use('/api/admin/login', require('./admin/login'))
}
