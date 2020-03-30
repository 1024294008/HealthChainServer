var db = require("../db/mysql")

var conn = db.connect()

function insert(params){
  var sql_insert = "insert into(sendAddress, recieveAddress, transactEth, transactTime, transactAddr, transactRemarks) values(?, ?, ?, ? ,? ,?)"
  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }
    console.log("插入成功");
    return res;
  })

// 参数列表[sendAddress, recieveAddress, transactTime]
function findByConditions(){

}
}
