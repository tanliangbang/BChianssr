import axios from 'axios'
import {logMessage} from "../udf/lib/helpers";
import * as api from '../../../../src/service/getData'
let datafeed = {
  onReady: function (configurationData) {
    configurationData({
      supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
      supports_marks: true,
      supports_search: true,
      supports_time: true,
      supports_timescale_marks: true
    })
    return null
  },
  calculateHistoryDepth: function (resolution, resolutionBack, intervalBack) {
    return {
      resolutionBack: 'M',
      intervalBack: 6
    }
  },
  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
  },
  getMarks (symbolInfo, startDate, endDate, onDataCallback, resolution) {
  },
  resolveSymbol: function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    let pricesale = Math.pow(10, this.currCoin.limitPricePrecision)
    onSymbolResolvedCallback({
      name: symbolName,
      description: symbolName,
      has_intraday: true,
      ticker: symbolName,
      session: '0930-1630:1234567',
      has_daily: true,
      has_weekly_and_monthly: true,
      data_status: 'streaming',
      has_no_volume: false,
      volume_precision: 0,
      currency_code: true,
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      pricescale: pricesale
    })
  },
  getBars (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    let date = this.dealDate(resolution)
    if (firstDataRequest) {
      console.log(symbolInfo.name)
      let symbol = symbolInfo.name.split('_')[0]
      let exchangeId = symbolInfo.name.split('_')[1]
      api.getKline({hisId: exchangeId, symbol: symbol, period: date.time}).then(function (res) {
        let data = res.data ? res.data : []
        let arr = []
        for (let i = 0; i < data.length; i++) {
          arr.push({time: data[i].dateTime , close: data[i].close, open: data[i].open, high: data[i].high, low: data[i].low, volume: data[i].vol})
        }
        onHistoryCallback(arr)
      })
    } else {
      onHistoryCallback([], {noData: true})
    }
  },
  subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback){
  },
  unsubscribeBars (subscriberUID) {
  },

  dealDate: function(resolution) {
    switch (resolution) {
      case '1':
        return {time: '1min'}
        break
      case '5':
        return {time: '5min'}
        break
      case '15':
        return {time: '15min'}
        break
      case '30':
        return {time: '30min'}
        break
      case '60':
        return {time: '60min'}
        break
      case '1D':
        return {time: '1day'}
        break
      case '1W':
        return {time: '1week'}
        break
      case '1M':
        return {time: '1mon'}
        break
    }
  }
}

export {datafeed}
