<template>
  <div class="index mainMg">
     <section>
        <div>
          <div>
            <Banner/>
          </div>
        </div>
        <div>
           <img src="static/img/bg_shujutu.png">
          <div>
            <p>{{$t("lang.index.estimatedValue")}}</p>
            <p>2.324 BTC</p>
            <p>~123456.78 CNY</p>
            <p>{{$t("lang.index.todayProfit")}}</p>
            <p>+1.28 BTC <span class="triangle-up">+52.1%</span></p>
          </div>
        </div>
     </section>
    <section>
      <!-- <ul>
         <li v-for="item in recommend" :key="item.id" v-on:click="toDetail()">
           <p :class="item.quotes.USD['percent_change_24h']>0?'raise':'fail'">
             {{item.quotes.USD["percent_change_24h"]+"%"}}
           </p>
           <p>{{item["symbol"]}}</p>
           <p>${{item.quotes.USD["price"]}}/￥{{item.quotes.CNY["price"]}}</p>
           <p>{{$t("lang.index.turnover")}}:{{item["circulating_supply"]}} {{item["symbol"]}}</p>
           <i></i>
         </li>
       </ul>-->
    </section>

    <section>
      <div class="header">
        <span v-for="(item, key) in coinList" :key='key' :class="currQuoteCoin===key?'selected':''" v-on:click="toChange(key)">{{key.toUpperCase()}}</span>
        <span :class="currQuoteCoin==='all'?'selected':''" v-on:click="toChange('all')">{{$t("lang.index.all")}}</span>
      </div>
      <div>
         <table v-show="currQuoteCoin === 'all'" class="coin_list" border="0" cellpadding="0" cellspacing="0">
            <thead>
               <tr>
                 <td width="15%">{{$t("lang.index.coin")}}</td>
                 <td width="16%">{{$t("lang.index.price")}} <div class="triangle"><span></span><span></span></div></td>
                 <td width="16%">{{$t("lang.index.totalValue")}} <div class="triangle"><span></span><span></span></div></td>
                 <td width="16%">{{$t("lang.index.totalAmount")}} <div class="triangle"><span></span><span></span></div></td>
                 <td width="16%">{{$t("lang.index.vol")}}(24) <div class="triangle"><span></span><span></span></div></td>
                 <td width="12%">{{$t("lang.index.change")}} <div class="triangle"><span></span><span></span></div></td>
               </tr>
            </thead>
            <tbody>
                <tr v-if="allMarket !== null" v-for="item in allMarket" :key="item.id" >
                  <td>{{item["symbol"]}}</td>
                  <td>${{item.quotes.USD["price"]}} <span class="cnyColor">≈￥{{item.quotes.CNY["price"]}}</span></td>
                  <td>${{item.quotes.USD["market_cap"]}}</td>
                  <td>{{item.quotes.USD["volume_24h"]}}</td>
                  <td>{{item["circulating_supply"]}} {{item["symbol"]}}</td>
                  <td :class="item.quotes.USD['percent_change_24h']>0?'raise':'fail'">
                    {{item.quotes.USD["percent_change_24h"]>0?'+'+item.quotes.USD["percent_change_24h"]+"%":item.quotes.USD["percent_change_24h"] +"%"}}
                  </td>
                </tr>
            </tbody>
         </table>

        <table v-show="currQuoteCoin !== 'all'" class="exchange_coin_list" border="0" cellpadding="0" cellspacing="0">
          <thead>
          <tr>
            <td width="6%">{{$t("lang.index.coin")}}</td>
            <td colspan="4" align="center">{{$t("lang.otc.exchange")}} </td>
          </tr>
          </thead>
          <tbody>
          <tr  v-for="(item, key) in coinList[currQuoteCoin]" :key="item.id"   >
            <td>{{key.toUpperCase()+' / '+ currQuoteCoin.toUpperCase()}}</td>
            <td  v-for="curr in item" >
              <div v-if="curr.tick" :class="curr.showAnimation?'exchange my_animation':'exchange'" v-on:click="toDetail(key.toLowerCase()+'_'+currQuoteCoin.toLowerCase(), curr.bilianHisId)">
                <div>
                  {{curr.tick.close?curr.tick.close: '--'}}
                </div>
                <div v-if="!curr.tick.close">--</div>
                <div v-if="curr.tick.close" :class="curr.tick.rose<0?'red':'green'">
                  {{((curr.tick.rose)*100).toFixed(2)+ '%'}}
                </div>
                <div>
                  <img :src="curr.logo"/>
                  <p>{{curr.bilianHisName}}</p>
                </div>
              </div>
            </td>
            <td v-for="item in new Array(4-item.length)">
              <div class="exchange"></div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </section>
  </div>
</template>

<script>
import Tool from '../utils/Tool'
import * as api from '../service/getData'
import Banner from '../plugins/banner/Banner'
import { mapGetters } from 'vuex'
import socketUtil from '../utils/socketUtil'
export default {
  name: 'Index',
  components: {
    Banner
  },
  data () {
    return {
      recommend: [],
      subscribed: [],
      currQuoteCoin: 'btc',
      exchangeCoinList: {},
      coinList: [],
      allMarket: []
    }
  },
  computed: {
    ...mapGetters({
      exchangeList: 'getExchangeList',
      allCoinList: 'getCoinList'
    })
  },
  created () {
    this.coinList = this.allCoinList
  },
  async mounted () {
    window.scrollTo(0, 0)
    socketUtil.addTick = this.addTick
    socketUtil.getTick = this.getTick
    if (this.exchangeList.length <= 0) {
      await this.$store.dispatch('getExchangelist')
    }
    this.getTick()
  },
  methods: {
    toDetail (symbol, exchangeId) {
      this.$router.push('/coinToCoin/' + symbol + '_' + exchangeId)
    },
    getTick () {
      let exchangeList = this.exchangeList
      let _this = this
      for (let i = 0; i < exchangeList.length; i++) {
        exchangeList[i]['ws'] = null
        socketUtil.createConnet(this, exchangeList[i], (cointigerWs) => {
          socketUtil.subscribeAllCoin(cointigerWs, exchangeList[i], _this.coinList[_this.currQuoteCoin], _this.subscribed)
        })
      }
    },
    isContain (arr, symbol, info) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].symbol === symbol) {
          arr[i].exchangeList.push(info)
          return true
        }
      }
      return false
    },
    async getAllMarkt () {
      let data = await api.getCoinList()
      if (data.status === 200) {
        data = data.data.data
        this.allMarket = data
      }
    },
    toChange (str) {
      this.currQuoteCoin = str
      if (str === 'all') {
        this.getAllMarkt()
      } else {
        socketUtil.subscribe(this, this.exchangeList, this.subscribed)
      }
    },
    filter (index) {
      return index > 5
    },
    formatDate (date) {
      return Tool.formatDate2(date, '-')
    },
    addTick(msg, exchange) {
      let symbol
      let temp
      let currCoinList = this.coinList[this.currQuoteCoin]
      for (let item in currCoinList) {
        symbol = (item + this.currQuoteCoin).toLowerCase()
        if (symbol === msg.channel.split('_')[1]) {
          for (let i = 0; i < currCoinList[item].length; i++) {
            if (currCoinList[item][i].bilianHisId === exchange['exchange_id']) {
              msg.tick.close = Tool.intercept(msg.tick.close, currCoinList[item][i].limitPricePrecision)
              if (currCoinList[item][i].tick && currCoinList[item][i].tick.close !== msg.tick.close && !currCoinList[item][i].showAnimation) {
                currCoinList[item][i].showAnimation = true
                temp = currCoinList[item][i]
                setTimeout(function () {
                  temp.showAnimation = false
                }, 500)
              }
              currCoinList[item][i].tick = msg.tick
              currCoinList[item][i].logo = exchange.logo
            }
            this.coinList = Object.assign({}, this.coinList)
          }
        }
      }
    }
  },
  destroyed: function () {
    for (let i = 0; i < this.subscribed.length; i++) {
      socketUtil.subscribefn(this.subscribed[i])
    }
    this.subscribed = []
  },
  async asyncData(context) {
    let store = context.store
    return store.dispatch('getCoinList')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index";
  .red{
    color:red;
  }
  .green{
    color:#00ffc0;
  }
  .nonbg{
    background:#284078;
  }
  .my_animation{
    background:#385fca;
  }
</style>
