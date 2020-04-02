var db = require("../db/mysql")

var conn = db.connect()

// 添加机构用户
function insert(params, callback){
  var sql_insert = 'insert into organization set ?'
  conn.query(sql_insert, params, function(err, result){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      callback(0)
      return
    }
    console.log("插入成功~")
    callback(1);
  })
}


// 删除机构用户[id]
function deleteByPrimaryKey(params, callback){
  var sql_delete = "delete from organization where id = ?"
  conn.query(sql_delete, params, function(err,result){
    if(err){
      console.log('[DELETE ERROR]-', err.message)
      callback(0)
      return
    }
    console.log("删除成功~")
    callback(1)
  })
}


// 更新机构用户的信息[{},id]
function updateByPrimaryKey(params, callback){
  console.log(params)
  var sql_update = "update organization set ? where id = ?"
  conn.query(sql_update, params, function(err,result){
    if(err){
      console.log('[UPDATE ERROR]-', err.message)
      callback(0)
      return
    }
    console.log("修改成功")
    callback(1)
  })
}

// 根据主键查询[id]
function findByPrimaryKey(params, callback){
  var sql_select = "select * from organization where id = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return
     }
    console.log("查询成功")
    callback(1, result)
  })
}

// 根据以太坊地址查询 参数[ethAddress]
function findByEthAddress(params, callback){
  var sql_select = "select * from organization where ethAddress = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return
    }
    console.log("查询成功")
    callback(1, result)
  })
}

// 根据账户查询 参数[account]
function findByAccount(params, callback){
  var sql_select = "select * from organization where account = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return
    }
    console.log("查询成功")
    callback(1, result)
  })
}

// 参数列表{"certificateResult": "..", "limit": 1, "page": 2}
function findByConditionsCount(params, callback){
  var sql_select_count = 'select count(*) as allCount from organization where 1 = 1 '  // 注意末尾空格

  if(params.certificateResult != "" && params.certificateResult != null)
    sql_select_count += 'and certificateResult = ' + '\"'  + params.certificateResult + '\" ' // 字符串拼接需要引号，注意末尾空格

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

// 参数列表{"certificateResult": "已通过", "limit": 1, "page": 2}
function findByConditions(params, callback){
  var sql_select = 'select * from organization where 1 = 1 ' // 注意末尾空格

  if(params.certificateResult != "" && params.certificateResult != null)
    sql_select += 'and certificateResult = ' + '\"'  + params.certificateResult + '\" ' // 字符串拼接需要引号，注意末尾空格

  sql_select += 'limit ' + params.limit*(params.page-1) + ',' + params.limit

  conn.query(sql_select, "",function(err, result){

    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
      return;
    }
    console.log("查找成功~");
    callback(1, result)
  })
}

// 通过服务id查询服务信息和机构信息
function findByServiceId(params, callback){
  var sql_select = "select medicalservice.id as id, organization.portrait as portrait_org, organizationName, introduction,serviceName,serviceDetails,cost, tel from organization, medicalservice where organization.id = (select oid from medicalservice where medicalservice.id = ?)"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return
    }
    console.log("查询成功")
    callback(1, result)
  })
}
module.exports = {
    insert,
    deleteByPrimaryKey,
    updateByPrimaryKey,
    findByPrimaryKey,
    findByEthAddress,
    findByAccount,
    findByConditionsCount,
    findByConditions,
    findByServiceId
}
