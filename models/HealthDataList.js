var events = require('events')

function HealthDataList(count){
  var list = []
  this.count = count

  var that = this
  var timer = setTimeout(() => {                   // 10s超时处理
    that.emit('dataAccepted', list)
  }, 10000);

  this.addHealthData = function(healData){
    list.push(healData)
    if(list.length >= this.count){     // 当监听接收的数据量达到count时(或者超时)触发此事件
      this.emit('dataAccepted', list)
      clearTimeout(timer)
    }
  }
}

HealthDataList.prototype.__proto__ = events.EventEmitter.prototype

module.exports = HealthDataList
