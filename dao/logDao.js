var db = require("../db/mysql")

var conn = db.connect()

// 参数{日志信息 json}
function insert(params, callback){
  var sql_insert = "insert into log set ? "
  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("插入成功~");
    callback(1);
  })
}

// 参数 id
function deleteByPrimaryKey(params, callback){
  var sql_delete = "delete from log where id = ?"

  conn.query(sql_delete, [params], function(err, res){
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      callback(0);
      return;
    }
    console.log("删除成功");
    callback(1);
  })
}

// 参数列表{"operateTime": "", "operateResult": "", "limit": 1, "page": 2}
function findByConditionsCount(params, callback){
  var sql_select_count = 'select count(*) from log where 1 = 1 '  // 注意末尾空格

  if(params.operateTime != "" && params.operateTime != null)
    sql_select_count += 'and operateTime = ' + '\"'  + params.operateTime + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.operateResult != "" && params.operateResult != null)
  sql_select_count += 'and operateResult = ' + '\"'  + params.operateResult + '\" ' // 字符串拼接需要引号，注意末尾空格

  console.log(sql_select_count)

  conn.query(sql_select_count, "",function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
      return;
     }
    console.log("条数查找成功~");
    callback(1, res);
  })
}

// 参数列表{"operateTime": "", "operateResult": "", "limit": 1, "page": 2}
function findByConditions(params, callback){
  var sql_select = 'select * from log where 1 = 1 '

  if(params.operateTime != "" && params.operateTime != null)
   sql_select += 'and operateTime = ' + '\"' + params.operateTime + '\" '

  if(params.operateResult != "" && params.operateResult != null)
   sql_select += 'or operateResult = ' + '\"' + params.operateResult + '\" '

  sql_select += 'limit ?, ?';

  conn.query(sql_select, [params.limit*(params.page-1), params.limit], function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
      return false;
    }
    console.log("查找成功")
    callback(1, res);
  })

}

module.exports = {
  insert,
  deleteByPrimaryKey,
  findByConditionsCount,
  findByConditions
}
