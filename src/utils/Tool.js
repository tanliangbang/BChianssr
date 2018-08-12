import md5 from './md5'
const Tool = {}
import {Decimal} from 'decimal'
/**
 * 格式化时间
 *
 * @param {any}
 * @returns
 */
Tool.formatDate1 = function (str) {
  let date = new Date(str)
  let time = new Date().getTime() - date.getTime() // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return ''
  } else if (time / 1000 < 60) {
    return '刚刚'
  } else if ((time / 60000) < 60) {
    return parseInt((time / 60000)) + '分钟前'
  } else if ((time / 3600000) < 24) {
    return parseInt(time / 3600000) + '小时前'
  } else if ((time / 86400000) < 31) {
    return parseInt(time / 86400000) + '天前'
  } else if ((time / 2592000000) < 12) {
    return parseInt(time / 2592000000) + '月前'
  } else {
    return parseInt(time / 31536000000) + '年前'
  }
}

Tool.decimal = function (a, b, opera) {
  if (!a) {
    a = 0
  }
  if (!b) {
    b = 0
  }
  if (opera === 'add') { // 加法
    return new Decimal(a).add(new Decimal(b)).toNumber()
  }
  if (opera === 'sub') { // 减法
    return new Decimal(a).sub(new Decimal(b)).toNumber()
  }
  if (opera === 'mul') { // 剩法
    return new Decimal(a).mul(new Decimal(b)).toNumber()
  }
  if (opera === 'div') { // 除法
    return new Decimal(a).div(new Decimal(b)).toNumber()
  }
}

/**
 * 格式化时间2
 *
 * @param {any} t
 * @returns
 */
Tool.formatDate2 = function (currDate, str) {
  if (currDate === '' || currDate == null) {
    return
  }
  currDate = parseInt(currDate)
  let nowDate = new Date(currDate)
  let year = nowDate.getFullYear() //  获取完整的年份(4位,1970-????)
  let month = nowDate.getMonth() + 1 //  获取当前月份(0-11,0代表1月)
  let day = nowDate.getDate() //  获取当前日(1-31)  v
  let hh = nowDate.getHours()
  let mm = nowDate.getMinutes()
  let ss = nowDate.getSeconds()
  if (str === 'china') {
    return (year + '年' + month + '月' + day + '日' + '  ' + hh + ':' + mm + ':' + ss)
  }
  if (month < 10) {
    month = '0' + month
  }

  if (day < 10) {
    day = '0' + day
  }

  if (hh < 10) {
    hh = '0' + hh
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  if (ss < 10) {
    ss = '0' + ss
  }
  return (year + str + month + str + day + '  ' + hh + ':' + mm + ':' + ss)
}

/**
 * 本地数据存储或读取
 *
 * @param {any} key
 * @param {any} value
 * @returns
 */
Tool.localItem = function (key, value) {
  if (arguments.length === 1) {
    return window.localStorage.getItem(key)
  } else {
    return window.localStorage.setItem(key, value)
  }
}

/**
 * 删除本地数据
 *
 * @param {any} key
 * @returns
 */
Tool.removeLocalItem = function (key) {
  if (key) {
    return window.localStorage.removeItem(key)
  }
  return window.localStorage.removeItem()
}

Tool.setCookie = function (name, value) {
  let Days = 30
  let exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

Tool.md5 = md5.hex_md5

Tool.isPoneAvailable = function (phone) {
  let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!myreg.test(phone)) {
    return false
  } else {
    return true
  }
}
Tool.isEmail = function (email) {
  var reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
  return reg.test(email)
}

Tool.getCookie = function (cname) {
  let name = cname + '='
  var ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
  }
  return null
}
Tool.delCookie = function (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = Tool.getCookie(name)
  console.log(cval)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

Tool.getTarget = function (evt) {
  return evt.target || evt.srcElement
}

Tool.stopProp = function (event) {
  if (event.stopPropagation) {
    event.stopPropagation()
  } else {
    event.cancelBubble = true
  }
}

Tool.trim = function(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

Tool.isLogin = function () {
  if (Tool.getCookie('ngtoken')) {
    return true
  }
  return false
}

Tool.intercept = function(num, size) {
  if (!num) return
  num = parseFloat(num).toFixed(size + 1)
  num = num + ''
  return num.substring(0, num.lastIndexOf('.') + size + 1)
}

Tool.isContains = function(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return true
    }
  }
  return false
}

/**
 * 金额检测
 *
 * @param {number} limit
 * @param {value} value
 * @returns
 */

Tool.numberCheck = function(value, limit) {
  if (value !== '' && value.substr(0, 1) === '.') {
    value = ''
  }
  value = value.replace(/^0*(0\.|[1-9])/, '$1') // 解决 粘贴不生效
  value = value.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  let rep = new RegExp('^(\\\\-)*(\\d+)\\.(\\d{' + limit + '}).*$')
  value = value.replace(rep, '$1$2.$3') // 只能输入两个小数
  if (value.indexOf('.') < 0 && value !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    if (value.substr(0, 1) === '0' && value.length === 2) {
      value = value.substr(1, value.length)
    }
  }
  return value
}

Tool.buyAndSellChange = function(way) {
  let temp
  switch (way) {
    case 'BUY_MARKET':
      temp = '市价买'
      break
    case 'SELL_MARKET':
      temp = '市价卖'
      break
    case 'BUY_LIMIT':
      temp = '限价买'
      break
    default:
      temp = '限价卖'
  }
  return temp
}

Tool.stateChange = function(state) {
  let temp
  switch (state) {
    case 'NEW':
      temp = '未成交'
      break
    case 'PARTIAL_FILLED':
      temp = '部分成交'
      break
    case 'FILLED':
      temp = '完全成交'
      break
    case 'CANCELED':
      temp = '已撤销'
      break
    default:
      temp = '错误订单'
  }
  return temp
}

Tool.changeOtcStatus = function(state) {
  let temp
  switch (state) {
    case 'UNFINISHED':
      temp = '未完成'
      break
    case 'FINISHED':
      temp = '已完成'
      break
    case 'CANCELED':
      temp = '已取消'
      break
    case 'TIMEOUT':
      temp = '超时取消'
      break
  }
  return temp
}

Tool.dealAsser = function(userInfo, currInfo, currAssert) {
  let obj = {}
  let exchagneAthers = userInfo.openExchangeAccount
  for (let i = 0; i < exchagneAthers.length; i++) {
    if (currInfo.exchangeId === exchagneAthers[i]['exchange_id']) {
      obj.currStatus = exchagneAthers[i].authStatus
      if (obj.currStatus === 1) {
        let data = currAssert.exchanges
        let len = data.length
        let list
        for (let i = 0; i < len; i++) {
          if (parseInt(data[i].bilianHisId) === currInfo.exchangeId) {
            list = data[i]
          }
        }
        if (list) {
          let asset = list.hisUserBalanceCurrencyList
          len = asset.length
          obj.currExchangeAssert = {}
          for (let i = 0; i < len; i++) {
            obj.currExchangeAssert[asset[i].currency] = asset[i]
          }
        }
      }
    }
  }
  return obj
}

export default Tool
