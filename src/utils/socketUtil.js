import pako from 'pako'
import Tool from './Tool'
const socketUtil = {}
socketUtil.subscribe = function (_this, exchangeList, subscribed) {
  for (let i = 0; i < exchangeList.length; i++) {
    this.createConnet(_this, exchangeList[i], (cointigerWs) => {
      this.subscribeAllCoin(cointigerWs, exchangeList[i], _this.coinList[_this.currQuoteCoin], subscribed)
    })
  }
}

socketUtil.createConnet = function(_this, exchange, callback) {
  if (exchange['ws'] && exchange['ws'] !== null && exchange['ws'].readyState === 1) {
    callback(exchange['ws'])
    return
  }
  let api = exchange['websocket_api']
  let cointigerWs = new window.WebSocket(api)
  cointigerWs.onopen = () => {
    callback(cointigerWs)
    exchange['ws'] = cointigerWs
  }
  cointigerWs.onmessage = (evt) => {
    let reader = new window.FileReader()
    // let obj = {}
    reader.onload = function(evt) {
      if (evt.target.readyState === window.FileReader.DONE) {
        let data = evt.target.result
        let text = pako.inflate(data, {
          to: 'string'
        })
        let msg = JSON.parse(text)
        if (msg.ping) {
          cointigerWs.send(JSON.stringify({
            pong: msg.ping
          }))
        } else if (msg.tick) {
          socketUtil.handle(msg, exchange)
        } else {
          cointigerWs.send(JSON.stringify({
            pong: msg.ping
          }))
        }
      }
    }
    reader.readAsArrayBuffer(evt.data)
  }
}

socketUtil.handle = function(msg, exchange) {
  let channel = msg.channel.split('_')[2]
  switch (channel) {
    case 'depth':
      socketUtil.addDepth(socketUtil.changeEntrustList(msg))
      break
    case 'kline':
      break
    case 'ticker':
      socketUtil.addTick(msg, exchange)
      break
  }
}

socketUtil.changeEntrustList = function(msg) {
  let entrustList = msg.tick
  let num
  for (let item in entrustList) {
    for (let i = 0; i < entrustList[item].length; i++) {
      if (i === 0) {
        entrustList[item][i].push(entrustList[item][i][1])
      } else {
        num = Tool.decimal(entrustList[item][i - 1][2], entrustList[item][i][1], 'add')
        entrustList[item][i].push(num)
      }
    }
  }
  return entrustList
}

socketUtil.subscribeAllCoin = function (cointigerWs, exchange, currCoinList, subscribed) {
  let symbol
  for (let item in currCoinList) {
    for (let i = 0; i < currCoinList[item].length; i++) {
      if (parseInt(exchange.exchange_id) === currCoinList[item][i].bilianHisId) {
        symbol = (currCoinList[item][i]['baseCurrency'] + currCoinList[item][i]['quoteCurrency']).toLowerCase()
        subscribed.push({
          ws: cointigerWs,
          event: 'unsub',
          channel: 'market_' + symbol + '_ticker',
          id: symbol
        })
        this.subscribefn({
          ws: cointigerWs,
          event: 'sub',
          channel: 'market_' + symbol + '_ticker',
          id: symbol
        })
      }
    }
  }
}

socketUtil.subscribefn = function (param) {
  param.ws.send(JSON.stringify({
    'event': param.event,
    'params': {
      'channel': param.channel,
      'cb_id': param.id
    }
  }))
}
export default socketUtil
