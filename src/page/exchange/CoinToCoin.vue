 <template>
  <div class="coinToCoin mainMg">
    <section>

      <div class="coin-nav">
        <span  :class="currSelect==='zx'?'selected':''" v-on:click="changeBase('zx')">{{$t("lang.exchange.optional")}} </span>
        <span v-for="(item, key) in allCoinList" v-if="key!=='zx'" :key="key" v-on:click="changeBase(key)" :class="currSelect===key?'selected':''">{{key.toUpperCase()}}</span>
      </div>

      <div class="container">
        <div class="coin-list">
          <div class="search">
            <input type="text" :placeholder='$t("lang.exchange.searchPromit")'>
            <button>{{$t("lang.exchange.search")}}</button>
          </div>
          <ul v-if="currInfo" class="scrollStyle">
            <li v-on:click="changeCoin(key, item[0]['quoteCurrency'].toLowerCase(), null)" v-if="item[0]"
                v-for="(item, key, index) in allCoinList[currSelect]"
                :class="currInfo.baseCoin===key&&item[0]['quoteCurrency'].toLowerCase()===currInfo.quoteCoin?'selected':''" :key="index">
              <span v-if="item[0].islike" v-on:click="collection($event, item, 'cut')"><img  src="./../../../static/img/collectioned.png"/></span>
              <span v-if="!item[0].islike" v-on:click="collection($event, item, 'add')"><img  src="./../../../static/img/collection.png"/></span>
              <span >{{key.toUpperCase()}}/{{item[0]['quoteCurrency'].toUpperCase()}}</span>
            </li>
          </ul>
        </div>
        <div class="coin-detail">
          <div class="coin-header" v-if="currInfo.currCoin">
            <span>{{currInfo.baseCoin.toUpperCase()+'/'+currInfo.quoteCoin.toUpperCase()}}</span>
            <span :class= "currInfo.currCoin.tick.rose > 0?'raise':'fail'">{{((currInfo.currCoin.tick.rose)*100).toFixed(2)+ '%'}}</span>
            <div>{{currInfo.currCoin.tick.close}}
              <span v-on:click="changeSort()">{{$t("lang.exchange.price")}}</span><div v-on:click="changeSort()" :class="'up'?'triangle up':'triangle down'"><span></span><span></span></div>
            </div>
          </div>
          <div class="exchange-list">
            <ul>
              <li v-on:click="changeExchange(item.bilianHisId)" :class="currInfo.exchangeId===item.bilianHisId?'selected':''" v-if="currInfo.exchangeList" v-for="(item, index) in currInfo.exchangeList" :key="index">
                <div v-if="item.tick"> {{item.tick.close}}</div>
                <div>
                  <span><img :src="item.logo"> {{item.bilianHisName}}</span>
                  <span v-if="item.tick" :class= "item.tick.rose > 0?'raise':'fail'">{{((item.tick.rose)*100).toFixed(2)+ '%'}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="keyLine">
            <KeyLine ref="keyLine" v-if="currInfo.currCoin" v-bind:currInfo="currInfo"/>
          </div>

          <div class="buy-input-list">
            <div>
              <div class="userAssert">
                <div class="no_login" v-if="userInfo===null">
                  请先" <a v-on:click="toLogin()">登入</a>"链一下,查看资产和交易
                </div>
                <CurrAssert ref="currAssert" v-if="userInfo!==null && currAssert" v-bind:currInfo = 'currInfo' v-bind:currAssert="currAssert"/>
              </div>
              <Entrust ref="entrust" v-bind:currAssert="currAssert" v-bind:userInfo="userInfo" v-bind:currInfo = 'currInfo' />
            </div>

            <div class="otherEntrustList">
              <CurrEntrustList  v-bind:entrustList = 'entrustList' v-bind:currInfo = 'currInfo'/>
            </div>
          </div>

          <EntrustList ref="myEntrustListRef" v-bind:pagination = 'pagination' v-bind:entrustList = 'myEntrustList' />

        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import KeyLine from './model/KeyLine'
  import CurrEntrustList from './model/CurrEntrustList'
  import Entrust from './model/Entrust'
  import CurrAssert from './model/CurrAssert'
  import * as api from '../../service/getData'
  import Tool from '../../utils/Tool'
  import { mapGetters } from 'vuex'
  import socketUtil from '../../utils/socketUtil'
  import EntrustList from '../../components/entrust/EntrustList'
  export default {
    name: 'CoinToCoin',
    components: {
      KeyLine,
      CurrEntrustList,
      Entrust,
      CurrAssert,
      EntrustList
    },
    computed: {
      ...mapGetters({
        exchangeList: 'getExchangeList',
        coinList: 'getCoinList',
        currAssert: 'getUserassert',
        userInfo: 'getUserInfo'
      })
    },
    data () {
      return {
        currSelect: null,
        currInfo: {},
        entrustList: null,
        myEntrustList: [],
        allCoinList: {},
        wsList: {},
        preCoin: null,
        preExchangeId: null,
        unSubscribes: [],
        currUserAsset: {},
        portfolioCoin: {},
        collectionLoading: false,
        pagination: {
          current: 1,
          total: 0,
          pageSize: 10,
          totalSize: 0,
          onShowSizeChange: this.getMyEntrustList,
          onChange: null
        }
      }
    },
    async created () {
      this.allCoinList = this.coinList
    },
    async mounted () {
      socketUtil.addTick = this.addTick
      socketUtil.addDepth = this.addDepth
      socketUtil.getTick = this.getTick
      if (this.exchangeList.length <= 0) {
        await this.$store.dispatch('getExchangelist')
      }
      let baseCoin, quoteCoin, exchangeId, query, exchangeList
      query = this.$route.params
      if (query.id) {
        baseCoin = query.id.split('_')[0]
        quoteCoin = query.id.split('_')[1]
        exchangeList = this.allCoinList[quoteCoin][baseCoin]
        if (query.id.split('_')[2]) {
          exchangeId = parseInt(query.id.split('_')[2])
        } else {
          exchangeId = exchangeList[0].bilianHisId
        }
      }
      this.currSelect = quoteCoin
      this.currInfo = {
        symbol: baseCoin + quoteCoin,
        baseCoin: baseCoin,
        quoteCoin: quoteCoin,
        exchangeId: exchangeId,
        exchangeList: exchangeList,
        currCoin: null
      }
      this.getTick()
      await this.$store.dispatch('getUserInfo')
      if (this.userInfo && this.userInfo !== null) {
        this.getPortfolioCoin()
        if (this.currInfo.exchangeId >= 0) {
          this.$refs.myEntrustListRef.toPage(1)
        }
        await this.$store.dispatch('getUserassert')
        this.$refs.currAssert.getAssert()
      }
    },
    methods: {
      addDepth (entrustList) {
        this.entrustList = entrustList
      },
      toLogin () {
        this.$router.push('/login')
        Tool.localItem('backUrl', this.$route.path)
      },
      async getPortfolioCoin() {
        console.log(this.co)
        let data = await api.getPortfolioCoin()
        this.portfolioCoin = data.data
        data = data.data
        this.changePortfolioCoin(data)
      },
      changePortfolioCoin(data) {
        let base, quote
        this.allCoinList['zx'] = {}
        for (let i = 0; i < data.length; i++) {
          base = data[i].split('/')[0].toLowerCase()
          quote = data[i].split('/')[1].toLowerCase()
          this.allCoinList['zx'][base] = this.allCoinList[quote][base]
          this.allCoinList[quote][base][0].islike = true
        }
      },
      async collection(event, item, opera) {
        Tool.stopProp(event)
        if (this.collectionLoading) {
          return
        }
        let curr = item[0].baseCurrency.toUpperCase() + '/' + item[0].quoteCurrency.toUpperCase()
        if (opera === 'add') {
          this.portfolioCoin.push(item[0].baseCurrency.toUpperCase() + '/' + item[0].quoteCurrency.toUpperCase())
        } else {
          for (let i = 0; i < this.portfolioCoin.length; i++) {
            console.log(this.portfolioCoin[i])
            if (this.portfolioCoin[i] === curr) {
              this.portfolioCoin.splice(i, 1)
            }
          }
        }
        this.collectionLoading = true
        let data = await api.collectionSymbol({portfolio: JSON.stringify(this.portfolioCoin)})
        this.collectionLoading = false
        if (data.status === 200) {
          if (opera === 'add') {
            item[0].islike = true
          } else {
            item[0].islike = false
          }
          this.changePortfolioCoin(data.data)
          this.allCoinList = Object.assign({}, this.allCoinList)
        } else {
          console.log('aaaaaaaaaaaa')
        }
      },
      async getTick() {
        let symbol = this.currInfo.baseCoin + this.currInfo.quoteCoin
        let allExchangeList = this.exchangeList
        let exchangeList = this.currInfo.exchangeList
        let len = exchangeList.length
        let len2 = allExchangeList.length
        let _this = this
        for (let i = 0; i < len; i++) {
          for (let j = 0; j < len2; j++) {
            if (exchangeList[i].bilianHisId === allExchangeList[j].exchange_id) {
              socketUtil.createConnet(_this, allExchangeList[j], (cointigerWs) => {
                if (_this.currInfo.exchangeId === exchangeList[i].bilianHisId) {
                  socketUtil.subscribefn({
                    ws: cointigerWs,
                    event: 'sub',
                    channel: 'market_' + symbol + '_depth_step0',
                    id: symbol
                  })
                  this.unSubscribes.push({
                    ws: cointigerWs,
                    event: 'unsub',
                    channel: 'market_' + symbol + '_depth_step0',
                    id: symbol
                  })
                }
                this.unSubscribes.push({
                  ws: cointigerWs,
                  event: 'unsub',
                  channel: 'market_' + symbol + '_ticker',
                  id: symbol
                })
                socketUtil.subscribefn({
                  ws: cointigerWs,
                  event: 'sub',
                  channel: 'market_' + symbol + '_ticker',
                  id: symbol
                })
              })
            }
          }
        }
      },
      async cancelEntrust(item) {
        let data = await api.cancelEntrust({
          bilianHisId: item.bilianHisId,
          bilianOrderId: item.bilianOrderId,
          hisOrderId: item.orderId,
          symbol: this.currInfo.baseCoin + this.currInfo.quoteCoin
        })
        if (data.status === 200) {
          item.stateStr = '已撤销'
          item.state = 'CANCELED'
          this.$refs.entrust.getUserAsset()
        } else {
          this.$prompt.error(data.message)
        }
      },
      decimal (a, b, opera) {
        return Tool.decimal(a, b, opera)
      },
      async getMyEntrustList(currpage, pageSize) {
        let pageIndex = (currpage - 1) * pageSize
        let data = await api.getEntrustListBySymbol({
          bilianHisId: this.currInfo.exchangeId,
          symbol: this.currInfo.baseCoin + this.currInfo.quoteCoin,
          states: 'NEW,PARTIAL_FILLED,FILLED,CANCELED',
          types: 'BUY_MARKET,SELL_MARKET,BUY_LIMIT,SELL_LIMIT',
          pageSize: pageSize,
          pageIndex: pageIndex
        })
        let precision = this.currInfo.currCoin.price_precision
        if (data.status === 200) {
          let myEntrustList = data.data
          this.pagination.totalSize = data.total
          let way, state
          for (let i = 0; i < myEntrustList.length; i++) {
            myEntrustList[i].createdAt = Tool.formatDate2(myEntrustList[i].createdAt, '/')
            state = myEntrustList[i].state
            way = myEntrustList[i].type
            myEntrustList[i].typeChina = Tool.buyAndSellChange(way)
            myEntrustList[i].stateStr = Tool.stateChange(state)
            myEntrustList[i].totalPrice = Tool.decimal(myEntrustList[i].price, myEntrustList[i].amount, 'mul')
            if (myEntrustList[i].state === 'PARTIAL_FILLED' || myEntrustList[i].state === 'FILLED') {
              myEntrustList[i].averagePrice = Tool.decimal(myEntrustList[i].fieldCashAmount, myEntrustList[i].fieldAmount, 'mul').toFixed(precision)
            } else {
              myEntrustList[i].averagePrice = '--'
            }
          }
          this.myEntrustList = myEntrustList
        } else {
          this.pagination.totalSize = 0
          this.myEntrustList = []
        }
      },
      unTickSubscribe () {
        for (let i = 0; i < this.unSubscribes.length; i++) {
          socketUtil.subscribefn(this.unSubscribes[i])
        }
        this.unSubscribes = []
      },
      changeBase (str) {
        this.currSelect = str
        // this.currItem = this.data[str][0]
        // this.$refs.keyLine.changeSymbol(this.currItem)
      },
      async changeCoin (baseCoin, quoteCoin) {
        this.$router.push('/coinToCoin/' + baseCoin + '_' + quoteCoin)
        this.preExchangeId = this.currInfo.exchangeId
        let exchangeList = this.allCoinList[quoteCoin][baseCoin]
        this.preCoin = this.currInfo.baseCoin + this.currInfo.quoteCoin
        this.currInfo.symbol = baseCoin + quoteCoin
        this.currInfo.baseCoin = baseCoin
        this.currInfo.quoteCoin = quoteCoin
        this.currInfo.exchangeList = exchangeList
        this.currInfo.exchangeId = null
        this.unTickSubscribe()
        this.getTick()
      },
      changeExchange (exchangeId) {
        this.currInfo.exchangeId = exchangeId
        let exchangeList = this.currInfo.exchangeList
        let ws, symbol
        symbol = this.currInfo.baseCoin + this.currInfo.quoteCoin
        for (let i = 0; i < this.exchangeList.length; i++) {
          if (this.exchangeList[i].exchange_id === exchangeId) {
            ws = this.exchangeList[i]['ws']
          }
        }
        for (let i = 0; i < exchangeList.length; i++) {
          if (exchangeList[i].bilianHisId === exchangeId) {
            this.currInfo.currCoin = exchangeList[i]
          }
        }
        let rsymbol = this.currInfo.baseCoin + '_' + this.currInfo.quoteCoin
        this.$router.push('/coinToCoin/' + rsymbol + '_' + exchangeId)
        for (let i = 0; i < this.unSubscribes.length; i++) {
          if (this.unSubscribes[i].channel === 'market_' + symbol + '_depth_step0') {
            socketUtil.subscribefn(this.unSubscribes[i])
            this.unSubscribes.splice(i, 1)
          }
        }
        socketUtil.subscribefn({
          ws: ws,
          event: 'sub',
          channel: 'market_' + symbol + '_depth_step0',
          id: symbol
        })
        this.unSubscribes.push({
          ws: ws,
          event: 'unsub',
          channel: 'market_' + symbol + '_depth_step0',
          id: symbol
        })
        this.$refs.entrust.changePrice()
        if (this.userInfo !== null) {
          this.$refs.currAssert.getAssert()
        }
        this.$refs.keyLine.changeSymbol(symbol, this.currInfo.exchangeId)
        this.$refs.myEntrustListRef.toPage(1)
      },
      changeEntrustList (msg) {
        this.entrustList = msg.tick
        let num
        for (let item in this.entrustList) {
          for (let i = 0; i < this.entrustList[item].length; i++) {
            if (i === 0) {
              this.entrustList[item][i].push(this.entrustList[item][i][1])
            } else {
              num = this.decimal(this.entrustList[item][i - 1][2], this.entrustList[item][i][1], 'add')
              this.entrustList[item][i].push(num)
            }
          }
        }
      },
      addTick(msg, exchange) {
        let exchangeId = exchange['exchange_id']
        let exchangeList = this.currInfo.exchangeList
        let temp
        for (let i = 0; i < exchangeList.length; i++) {
          if (exchangeList[i].bilianHisId === exchangeId) {
            msg.tick.close = Tool.intercept(msg.tick.close, exchangeList[i].limitPricePrecision)
            exchangeList[i].tick = msg.tick
            exchangeList[i].logo = exchange.logo
            if (this.currInfo.exchangeId !== null && this.currInfo.exchangeId >= 0) {
              if (exchangeList[i].bilianHisId === this.currInfo.exchangeId) {
                temp = this.currInfo.currCoin === null ? 0 : 1
                this.currInfo.currCoin = exchangeList[i]
                if (this.$refs.entrust && temp === 0) {
                  this.$refs.entrust.changePrice()
                }
              }
            } else {
              if (this.currInfo.exchangeId == null) {
                this.currInfo.exchangeId = exchangeList[0].bilianHisId
                exchangeList[0].tick = msg.tick
                this.currInfo.currCoin = exchangeList[0]
              } else {
                if (exchangeList[i].bilianHisId === this.currInfo.exchangeId) {
                  this.currInfo.currCoin = exchangeList[i]
                }
              }
              this.$refs.myEntrustListRef.toPage(1)
              this.$refs.entrust.changePrice()
              if (this.userInfo !== null) {
                this.$refs.currAssert.getAssert()
              }
              for (let i = 0; i < this.exchangeList.length; i++) {
                if (this.exchangeList[i].exchange_id === this.currInfo.exchangeId) {
                  if (this.exchangeList[i]['ws']) {
                    socketUtil.subscribefn({
                      ws: this.exchangeList[i]['ws'],
                      event: 'sub',
                      channel: 'market_' + this.currInfo.symbol + '_depth_step0',
                      id: this.currInfo.symbol
                    })
                    this.unSubscribes.push({
                      ws: this.exchangeList[i]['ws'],
                      event: 'unsub',
                      channel: 'market_' + this.currInfo.symbol + '_depth_step0',
                      id: this.currInfo.symbol
                    })
                  }
                  if (this.$refs.keyLine) {
                    this.$refs.keyLine.changeSymbol(this.currInfo.symbol, this.currInfo.exchangeId)
                  }
                }
              }
            }
          }
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
      }
    },
    destroyed: function () {
      this.preExchangeId = this.currInfo.exchangeId
      this.unTickSubscribe()
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
  .coinToCoin{
    .coin-nav{
      height:70px;
      background:@bg_color;
      >span{
        font-size: 18px;
        padding:0px 40px;
        line-height: 70px;
        display:inline-block;
        cursor: pointer;
        color:#fff;
      }
      >span:nth-child(1) {
        padding:0px 80px;
      }
      .selected{
        background:#284585;
      }
    }
    .container{
      margin-top:25px;
      width:100%;
      position:relative;
      height:1920px;
      .coin-list{
        width:345px;
        background:@bg_color;
        position:absolute;
        left:0px;
        top:0px;
        background:@bg_color;
        >ul{
          height:1860px;
          width:100%;
          overflow-y: auto;
          li{
            cursor: pointer;
            line-height:52px;
            padding-left:15px;
            >span:nth-child(2) {
              color:#fff;
            }
            >span:nth-child(3){
              float:right;
              color: #0aa7ff;
            }
          }
          .selected{
            background: #284585;
          }
        }
      }
      .coin-detail{
        width:100%;
        padding-left:360px;
        .coin-header{
          height:64px;
          width:100%;
          color:#fff;
          line-height: 64px;
          background:@mainColor;
          >span:nth-child(1) {
            font-size: 25px;
            padding-left:38px;
          }
          >span:nth-child(2) {
            margin-left:34px;
            font-size:20px;
          }
          >div:nth-child(3) {
            float:right;
            margin-right:95px;
            font-size:18px;
            >span{
              margin-left:80px;
              margin-right:5px;
              cursor: pointer;
            }
            .up{
              span:nth-child(1)::after{
                border-bottom: 6px solid #0aa7ff;
              }
              span:nth-child(2)::after{
                border-top: 6px solid rgba(255,255,255,0.3);
              }
            }
            .down{
              span:nth-child(1)::after{
                border-bottom: 6px solid rgba(255,255,255,0.3);
              }
              span:nth-child(2)::after{
                border-top: 6px solid #0aa7ff;
              }
            }
            .triangle{
              display:inline-block;
              cursor: pointer;
              span:nth-child(1)::after{
                content:" ";
                width: 0;
                height: 0;
                position:absolute;
                top:26px;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
              }
              span:nth-child(2)::after{
                content:" ";
                width: 0;
                height: 0;
                position:absolute;
                top:34px;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
              }
            }
          }
        }
        .exchange-list{
          width:100%;
          overflow: hidden;
          height:140px;
          ul{
            margin:10px 0;
            width:5000px;
            height:120px;
            li{
              float:left;
              width:280px;
              height:100%;
              color:#fff;
              margin-right:10px;
              background:@bg_color;
              border-radius:3px;
              >div:nth-child(1) {
                margin-top:30px;
                margin-right:23px;
                font-size: 20px;
                text-align: right;
              }
              >div:nth-child(2) {
                margin-top:15px;
                img{
                  width:22px;
                  height:22px;
                  border-radius: 50%;
                  vertical-align: -4px;
                }
                span:nth-child(1) {
                  margin-left:56px;
                  font-size: 18px;
                }
                span:nth-child(2) {
                  font-size: 16px;
                  margin-right:23px;
                  float:right;
                }
              }
            }
            li:after{
              display:block;
              clear:both;
              content:"";
              visibility:hidden;
              height:0
            }
            .selected{
              background:#284da1;
            }
            li:hover{
              border:2px solid #284da1;
            }
          }
        }
      }
    }
  }
  .search{
    width: 100%;
    height: 51px;
    background-color: #273c6e;
    border-radius: 8px;
    border: solid 2px #304a87;
    position:relative;
    margin-bottom:10px;
    input{
      width:100%;
      height:100%;
      background-color: #273c6e;
      border:none;
      padding-right:90px;
      font-size: 17px;
      color: #a9c2fd;
      padding-left:25px;
      border-radius: 8px;
    }
    button{
      width: 88px;
      height: 43px;
      background-color: #4177fc;
      border-radius: 5px;
      border:none;
      color:#fff;
      font-size: 17px;
      position:absolute;
      right:2px;
      top:2px;
    }
  }

  .buy-input-list{
    margin-top:20px;
    margin-bottom:20px;
    >div:nth-child(1) {
      float:left;
      width:54%;
    }
    >div:nth-child(2) {
      padding-left:18px;
      float:left;
      width:46%;
      box-sizing: border-box;
    }
  }
  .buy-input-list:after {
    clear:both;
    content:'';
    display:block;
    width:0;
    height:0;
    visibility:hidden;
  }

  .entrustList{
    width:100%;
    background:@bg_color;
    margin-top:0px;
    thead{
      td{
        border-bottom:2px solid @index_bg;
      }
    }
    tbody{
      td{
        border-bottom:1px solid @index_bg;
      }
      tr:last-child{
        td{
          border-bottom:none;
        }
      }
    }
    tr{
      line-height: 50px;
      td{
        text-align: center;
      }
    }
  }
  .opera{
    color:@click_color;
    cursor:pointer;
  }
  .no_login{
    line-height: 110px;
    text-align: center;
    font-size:16px;
    color:#fff;
    a{
      color: #39f1ff;
      cursor: pointer;
    }
  }
  .userAssert{
    height:112px;
    background:@bg_color;
  }
  .keyLine{
    height:500px;
    background:@bg_color;
  }
  .otherEntrustList{
    height:560px;
  }

</style>
