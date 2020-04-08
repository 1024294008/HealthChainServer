// npm install node-xlsx；
// npm install fs

var excel = require('node-xlsx')
var fs = require('fs')

var data = []
var title = ['id',	'account',	'portrait',	'nickname',	'password',	'ethAddress',	'sex',	'address',	'birth',	'tel',	'contractAddr',	'privateKey']

var result = [{id: 1, account:'123456'}, {id: 2, account: '456798'}]

var N = result.length// 查询结果的大小

data.push(title) // 标题添加到excel中

for(var i=0;i<N;i++){
  var row = [];
  row.push(result[i].id);
  row.push(result[i].account);
  // 把其他字段添加到excel中
  data.push(row);
}

// 保存excel
function writeXls(datas){
  var buffer = excel.build([
    {
        name:'sheet1',
        data:datas
    }
]);
fs.writeFileSync('./xxx.xlsx',buffer,{'flag':'w'});//生成excel xxx是excel的名字
}

writeXls(data)


