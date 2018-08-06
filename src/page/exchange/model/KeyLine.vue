<template>
  <div class="keyLine">
    <div v-if="maskShow" v-on:click="hideMask($event)" class="hideMask"></div>
    <div id="tv_chart_container"></div>
  </div>
</template>

<script>
import {datafeed} from 'static/charting_library/datafeeds/myudf/datafeed'
let  TradingView = null
if (typeof window !== 'undefined') {
  TradingView = require('static/charting_library/charting_library/charting_library.min.js')
}
export default {
  name: 'KeyLine',
  components: {
  },
  props: [
    'currInfo'
  ],
  data () {
    return {
      maskShow: true,
      widget: null
    }
  },
  mounted () {
    let symbol = this.currInfo.baseCoin + this.currInfo.quoteCoin
    let _this = this
    datafeed.currCoin = this.currInfo.currCoin
    let widget = this.widget = new TradingView.widget({
      fullscreen: true,
      symbol: symbol + "_" + this.currInfo.exchangeId,
      interval: '1',
      timezone:'Asia/Shanghai',
      toolbar_bg: '#273c6c',
      allow_symbol_change: true,
      container_id: "tv_chart_container",
      datafeed: datafeed,
      library_path: "../../../static/charting_library/charting_library/",
      locale: "zh",
      custom_css_url:"css/charting.css",
      drawings_access: { type: 'black', tools: [ { name: "Regression Trend" } ] },
      disabled_features: ["use_localstorage_for_settings", "volume_force_overlay"],
      fullscreen:false,
      debug:true,
      drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
      disabled_features: ["use_localstorage_for_settings", "header_chart_type","header_symbol_search", "timeframes_toolbar",
        "volume_force_overlay", "header_saveload", "header_resolutions", "header_compare", "header_undo_redo",
        "header_screenshot", "display_market_status","adaptive_logo","dont_show_boolean_study_arguments"],
      overrides: { //k线的颜色
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#ddd",
        "paneProperties.vertGridProperties.color": "#273c6c",
        "paneProperties.horzGridProperties.color": "#273c6c",
        "paneProperties.crossHairProperties.color": "#fafafa",
        "volumePaneSize": "small",
        "paneProperties.legendProperties.showLegend": false, //折叠信息
        "paneProperties.background": '#273c6c',
        "mainSeriesProperties.candleStyle": {
          upColor: "#589065",
          downColor: "#ae4e54",
          drawBorder: true,
          borderColor: "#ae4e54",
          borderUpColor: "#589065",
          borderDownColor: "#ae4e54",
          drawWick: true,
          wickColor: "#737375",
          wickUpColor: "#589065",
          wickDownColor: "#ae4e54",
          barColorsOnPrevClose: !1,
        }
      },
      width:'100%',
      height:500
    });

    widget.onChartReady(function() {
      widget.chart().createStudy("Moving Average", false, false, [5], null, { "plot.color": "#9660c4" });
      widget.chart().createStudy("Moving Average", false, false, [10], null, { "plot.color": "#84aad5" });
      widget.chart().createStudy("Moving Average", false, false, [20], null, { "plot.color": "#55b263" });
      var c = widget.chart().getAllStudies()
      widget.chart().executeActionById("drawingToolbarAction");
      widget.chart().executeActionById("studyHide");
      var timeList = ['1', '5', '15', '30', '60', '1D', '1W', '1M']
      let buttonArr = []
      let fx = widget.createButton().attr('title', "分时").append('<span>'+ "分时" +'</span>')
      fx.parent().addClass("dataSelect")
      buttonArr.push(fx)
      fx.on('click',function(){
        for (let i = 0; i < buttonArr.length; i++) {
          buttonArr[i].removeClass('selected')
        }
        fx.addClass('selected')
        widget.chart().setChartType(3)
      })
      timeList.forEach(function(v){
        let button = widget.createButton();
        button.attr('title', v)
        if (v === '1') {
          button.addClass('selected')
        }
        button.parent().addClass("dataSelect")

        button.append('<span>'+ _this.dayChange(v) +'</span>')
        buttonArr.push(button)
        button.on('click', function(a){
          localStorage.setItem('klineTime', v);
          widget.chart().setChartType(1)
          for (let i = 0; i < buttonArr.length; i++) {
            buttonArr[i].removeClass('selected')
          }
          button.addClass('selected')
          widget.chart().setResolution(v, function(){

          })
        })
      })
    });
  },
  methods: {
    hideMask(e) {
      e.stopPropagation()
      this.maskShow = false
    },
    dayChange (str) {
      if (str==='1D') {
        return '1day'
      } else if (str==='1W') {
        return '1week'
      } else if (str==='1M') {
        return '1mon'
      } else {
        return str + 'min'
      }
    },
    changeSymbol(symbol, exchangeId) {
       let str = symbol + '_' + exchangeId
       datafeed.currCoin = this.currInfo.currCoin
      this.widget.chart().setSymbol(str, function () {
       })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.keyLine{
  width:100%;
  position:relative;
  .hideMask{
    width:100%;
    position:absolute;
    top:40px;
    left:0px;
    height:465px;
  }
}
</style>
