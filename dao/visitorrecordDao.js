var db = require("../db/mysql")
var conn = db.connect()

function insert(params, callback){
  var sql_insert = 'insert into visitorrecord set ?'
  conn.query(sql_insert, params, function(err, result){
    if(err){
      console.log('[INSERT visitorrecord ERROR] - ',err.message);
      callback(0);
      return;
     }
     console.log("插入成功~")
     callback(1);
  })
}

function findCountByUserid(params, callback){
  console.log("Dao")
  var sql_select = "select count(*) as allCount from visitorrecord where userid = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[SELECT COUNT ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("查找成功")
    callback(1, result);
  })
}

function findAllRecordsByUserid(params, callback){
  var sql_select = "select * from visitorrecord where userid = ? "
  conn.query(sql_select, params.userid, function(err, result){
    if(err){
      console.log('[SELECT ALL RECORD ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("查找访客记录成功")
    callback(1, result);

  })
}


// 访问时间  机构名称
function findRecordAndOrnInfoByUserId(params, callback){
  var sql_select = "select visitTime, organizationName from visitorrecord, organization " +
  "where visitorrecord.visitorId = organization.id and visitorrecord.userId = ?"

  conn.query(sql_select, [params], function(err, result){
    if(err){
      console.log('[SELECT ALL RECORD ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("查找访客记录成功")
    callback(1, result);
  })
}

module.exports = {
  insert,
  findCountByUserid,
  findAllRecordsByUserid,
  findRecordAndOrnInfoByUserId
}
