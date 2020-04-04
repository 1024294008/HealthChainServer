function format(Date,str){
	var obj = {
		Y: Date.getFullYear(),
		M: Date.getMonth() + 1,
		D: Date.getDate(),
		H: Date.getHours(),
		Mi: Date.getMinutes(),
		S: Date.getSeconds()
	}
	// 拼接时间 hh:mm:ss
	var time = ' ' +supplement(obj.H) + ':' + supplement(obj.Mi) + ':' + supplement(obj.S);
	// yyyy-mm-dd
	if(str.indexOf('-') > -1){
		return obj.Y + '-' + supplement(obj.M) + '-' + supplement(obj.D) + time;
	}
	// yyyy/mm/dd
	if(str.indexOf('/') > -1){
		return obj.Y + '/' + supplement(obj.M) + '/' + supplement(obj.D) + time;
	}
}

// 位数不足两位补全0
function supplement(nn){
	return nn = nn < 10 ? '0' + nn : nn;
}


// var nowDate = new Date();
// console.log(format(nowDate,'-'));// 2018-03-10 19:53:39

module.exports = {
  format,
}
