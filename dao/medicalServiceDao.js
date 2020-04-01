var db = require("../db/mysql")

var conn = db.connect()

function insert(params, callback){
  var sql_insert = 'insert into medicalservice set ?'
  conn.query(sql_insert, params, function(err, result){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      callback(0);
      return;
     }
     console.log("插入成功~")
     callback(1);
  })
}
function deleteByPrimaryKey(params, callback){
  var sql_delete = "delete from medicalservice where id = ?"
  conn.query(sql_delete, params, function(err, result){
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      callback(0)
      return;
     }
     console.log("删除成功~")
     callback(1)
  })
}

function updateByPrimaryKey(params, callback){
  var sql_update = "update medicalservice set ? where id = ?"
  conn.query(sql_update, params, function(err, result){
    if(err){
      console.log('[UPDATE ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("修改成功~")
    callback(1)
  })
}

function findByPrimaryKey(params, callback){
  var sql_select = "select * from medicalservice where id = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return;
     }
    console.log("查找成功")
    callback(1, result)
  })
}

function findByAccount(params, callback){
  var sql_select = "select * from medicalservice where account = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("查找成功")
    callback(1, result);
  })
}

// 获取所有审核通过的医疗服务
function findAllAudited(callback){
  var sql_select = "select * from medicalservice where auditResult = '审核通过'"
  conn.query(sql_select, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("查找成功")
    callback(1, result);
  })
}

function findByConditionsCount(params, callback){
  var sql_select_count = 'select count(*) as allCount from medicalservice where 1 = 1 '  // 注意末尾空格

  if(params.oid)
    sql_select_count += 'and oid = ' + '\"'  + params.oid + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.auditResult)
    sql_select_count += 'and auditResult = ' + '\"'  + params.auditResult + '\" ' // 字符串拼接需要引号，注意末尾空格

  console.log(sql_select_count)

  conn.query(sql_select_count, "",function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0, res);
      return;
     }
    console.log("条数查找成功~");
    callback(1, res);
  })
}

function findByConditions(params, callback){
  var sql_select = 'select * from medicalservice where 1 = 1 ' // 注意末尾空格

  if(params.oid)
    sql_select += 'and oid = ' + '\"'  + params.oid + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.auditResult)
    sql_select += 'and auditResult = ' + '\"'  + params.auditResult + '\" ' // 字符串拼接需要引号，注意末尾空格

  sql_select += 'limit ' + params.limit*(params.page-1) + ',' + params.limit
  // sql_select += 'limit ?, ?';

  conn.query(sql_select, "",function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0, res);
      return;
     }
    console.log("查找成功~");
    callback(1, res);
  })
}
module.exports = {
  insert,
  deleteByPrimaryKey,
  updateByPrimaryKey,
  findByPrimaryKey,
  findByAccount,
  findAllAudited,
  findByConditionsCount,
  findByConditions
}
