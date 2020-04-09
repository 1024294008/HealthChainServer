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
  app.use('/api/user/transfer', require('./users/transfer'))
  app.use('/api/user/getHealthCount', require('./users/getHealthCount'))
  app.use('/api/user/getHealthDataList', require('./users/getHealthDataList'))
  app.use('/api/user/transferUserToUser', require('./users/transferUserToUser'))
  app.use('/api/user/getUserTransactionRecord', require('./users/getUserTransactionRecord'))
  app.use('/api/user/getOneTransactionRecord', require('./users/getOneTransactionRecord'))
  app.use('/api/user/findRecordAndOrnInfoByUserId', require('./users/findRecordAndOrnInfoByUserId'))
  app.use('/api/user/findBytransactRemarks', require('./users/findBytransactRemarks'))
  app.use('/api/user/findRecordByEthAddress', require('./users/findRecordByEthAddress'))
  app.use('/api/user/UserTransactionRecordDetail', require('./users/UserTransactionRecordDetail'))
  app.use('/api/user/distanceChart', require('./users/distanceChart'))
  app.use('/api/user/uploadTimeChart', require('./users/uploadTimeChart'))

  app.use('/api/user/permitVisitChart', require('./users/permitVisitChart'))
  app.use('/api/user/sleepQualityChart', require('./users/sleepQualityChart'))
  app.use('/api/user/heartRateChart', require('./users/heartRateChart'))




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
  app.use('/api/org/transfer', require('./org/transfer'))
  app.use('/api/org/getBalance', require('./org/getBalance'))
  app.use('/api/org/getAllUsers', require('./org/getAllUsers'))
  app.use('/api/org/getUserAuth', require('./org/getUserAuth'))
  app.use('/api/org/getUserHealthDataCount', require('./org/getUserHealthDataCount'))
  app.use('/api/org/authFromUser', require('./org/authFromUser'))
  app.use('/api/org/getTransferHistory', require('./org/getTransferHistory'))



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
  app.use('/api/admin/transferToUser', require('./admin/transferToUser'))
  app.use('/api/admin/transfer', require('./admin/transfer'))
  app.use('/api/admin/transactionRecord', require('./admin/transactionRecord'))
  app.use('/api/admin/transactionRecordByType', require('./admin/transactionRecordByType'))
  app.use('/api/admin/getMinerInfo', require('./admin/getMinerInfo'))
  app.use('/api/admin/getBlockInfo', require('./admin/getBlockInfo'))

  app.use('/api/admin/getContractInfo_payforHealthData', require('./admin/getContractInfo_payforHealthData'))
  app.use('/api/admin/getContractInfo_uploadSection', require('./admin/getContractInfo_uploadSection'))
  app.use('/api/admin/getContractInfo_validSection', require('./admin/getContractInfo_validSection'))
  app.use('/api/admin/getContractInfo_award', require('./admin/getContractInfo_award'))

  app.use('/api/admin/setContractInfo_payforHealthData', require('./admin/setContractInfo_payforHealthData'))
  app.use('/api/admin/setContractInfo_uploadSection', require('./admin/setContractInfo_uploadSection'))
  app.use('/api/admin/setContractInfo_validSection', require('./admin/setContractInfo_validSection'))
  app.use('/api/admin/setContractInfo_award', require('./admin/setContractInfo_award'))





  /* common路由 */
  app.use('/api/common/getOrgInfo', require('./common/getOrgInfo'))
  app.use('/api/common/getMedicalServiceInfo', require('./common/getMedicalServiceInfo'))
  app.use('/api/common/transferFromUser', require('./common/transferFromUser'))
  app.use('/api/common/transferFromOrg', require('./common/transferFromOrg'))
  app.use('/api/common/getServiceAndOrg', require('./common/getServiceAndOrg'))
  app.use('/api/common/uploadOrgHealthData', require('./common/uploadOrgHealthData'))
  app.use('/api/common/uploadUserHealthData', require('./common/uploadUserHealthData'))
}
