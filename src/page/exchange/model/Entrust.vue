<template>
  <div v-if="currInfo.currCoin">
    <div class="entrust">
      <div>
        <a :class="type==='limit'?'limit':'clickBtn'" v-on:click="changeType('limit')">{{$t("lang.exchange.limitOrder")}}</a>
        <div>
          <div class="praceInput">
            <div>
              <span>{{$t("lang.exchange.price")}}</span>
              <span >{{type!=='markt'?currInfo.quoteCoin.toUpperCase():''}}</span>
              <input v-if="type!=='markt'" v-on:keyup="buyPriceKeyup($event)"  v-model="buy.price" />
              <input v-if="type==='markt'" class="gray" :value="$t('lang.exchange.martkPrompt')"/>
            </div>
            <p>≈{{decimal(buy.price, currRate, 'mul').toFixed(2)}} CNY</p>
          </div>
          <div class="praceInput">
            <div>
              <span>{{type==='markt'?$t("lang.exchange.totalPrice"):$t("lang.exchange.amount")}}</span>
              <span>{{type==='markt'?currInfo.quoteCoin.toUpperCase():currInfo.baseCoin.toUpperCase()}}</span>
              <input v-on:keyup="buyNumberKeyup()" v-model="buy.number"/>
            </div>
            <div class="process">
               <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <div class="totalPrice" >
            <span v-if="type==='limit'">{{$t("lang.exchange.totalPrice")}}: {{totalBuyPrice +' '+currInfo.quoteCoin.toUpperCase()}}</span>
          </div>
          <div>
            <a :class="buy_status===2?'ok_button buyBtn':'no_button buyBtn'" v-on:click="buyFn('buy')">
              <span v-if="buy_status===0||buy_status===2">{{$t("lang.exchange.mbuy")}} {{currInfo.baseCoin.toUpperCase()}}</span>
              <img v-if="buy_status===1" src="../../../../static/img/loading.png" />
            </a>
          </div>
        </div>
      </div>
      <div>
        <a :class="type==='markt'?'markt':'clickBtn'" v-on:click="changeType('markt')">{{$t("lang.exchange.marketOrder")}}</a>
        <div>
          <div class="praceInput">
            <div>
              <span>{{$t("lang.exchange.price")}}</span>
              <span>{{type!=='markt'?currInfo.quoteCoin.toUpperCase():''}}</span>
              <input v-if="type!=='markt'" v-on:keyup="sellPriceKeyup()"  v-model="sell.price"/>
              <input v-if="type==='markt'" class="gray"  :value="$t('lang.exchange.martkPrompt')"/>
            </div>
            <p>≈{{decimal(sell.price, currRate, 'mul').toFixed(2)}} CNY</p>
          </div>
          <div class="praceInput">
            <div>
              <span>{{$t("lang.exchange.amount")}}</span>
              <span>{{currInfo.baseCoin.toUpperCase()}}</span>
              <input v-on:keyup="sellNumberKeyup()" v-model="sell.number"/>
            </div>
            <div class="process">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <div class="totalPrice" >
            <span v-if="type==='limit'">{{$t("lang.exchange.totalPrice")}}: {{totalSellPrice +' '+ currInfo.quoteCoin.toUpperCase()}}</span>
          </div>
          <div>
            <a :class="sell_status===2?'ok_button buyBtn':'no_button buyBtn'" v-on:click="buyFn('sell')">
              <span v-if="sell_status===0||sell_status===2">{{$t("lang.exchange.msell")}} {{currInfo.baseCoin.toUpperCase()}}</span>
              <img v-if="sell_status===1" src="../../../../static/img/loading.png" />
            </a>
          </div>
        </div>
      </div>
    </div>

  </div>


</template>

<script>
import * as api from '../../../service/getData'
import Tool from '../../../utils/Tool'
export default {
  name: 'Entrust',
  components: {
  },
  props: ['currInfo', 'userInfo', 'currAssert'],
  data () {
    return {
      currList: null,
      type: 'limit',
      currAsset: null,
      currAssetList: [],
      sell_status: 0,
      buy_status: 0,
      totalSellPrice: 0,
      totalBuyPrice: 0,
      rateList: null,
      currRate: 1,
      currStatus: 0,
      currExchangeAssert: null,
      buy: {
        price: 0,
        number: 0
      },
      sell: {
        price: 0,
        number: 0
      }
    }
  },
  created () {
  },
  methods: {
    changePrice() {
      this.getRate(this.currInfo.exchangeId)
      this.sell.price = this.buy.price = this.currInfo.currCoin.tick.close
    },
    async getRate (hisId) {
      let data = await api.getRate({hisId: hisId})
      if (data.status === 200) {
        this.rateList = data.data
        this.changeRate(hisId)
      } else {
        console.log(data.message)
      }
    },
    changeRate () {
      let str
      let curr = this.rateList
      let len = curr.length
      for (let i = 0; i < len; i++) {
        str = this.currInfo.quoteCoin.toUpperCase() + '_CNY'
        if (curr[i].name === str) {
          this.currRate = curr[i].rate
          console.log(curr)
        }
      }
    },
    changeType(str) {
      this.type = str
      this.buy = {
        price: this.currInfo.currCoin.tick.close,
        number: 0
      }
      this.sell = {
        price: this.currInfo.currCoin.tick.close,
        number: 0
      }
    },
    decimal (a, b, opera) {
      return Tool.decimal(a, b, opera)
    },
    checkUserInfo() {
      if (this.userInfo === null) {
        return false
      }
      if (parseInt(this.userInfo.levelOneAuthStatus) !== 1) {
        return false
      }
      let obj = Tool.dealAsser(this.userInfo, this.currInfo, this.currAssert)
      if (obj.currStatus === 0) {
        return false
      }
      let buyAvailable = obj['currExchangeAssert'][this.currInfo.quoteCoin.toUpperCase()].trade
      let sellAvailable = obj['currExchangeAssert'][this.currInfo.baseCoin.toUpperCase()].trade
      return {
        buyAvailable: parseFloat(buyAvailable),
        sellAvailable: parseFloat(sellAvailable)
      }
    },
    buyPriceKeyup (event) {
      this.buy.price = 0
      let limitPricePrecision = this.currInfo.currCoin.limitPricePrecision
      this.buy.price = Tool.numberCheck(this.buy.price, limitPricePrecision)
      this.keyBuyCheck()
    },
    buyNumberKeyup () {
      let limitVolumePrecision = this.currInfo.currCoin.limitVolumePrecision
      this.buy.number = Tool.numberCheck(this.buy.number, limitVolumePrecision)
      this.keyBuyCheck()
    },
    sellPriceKeyup () {
      let limitPricePrecision = this.currInfo.currCoin.limitPricePrecision
      this.sell.price = Tool.numberCheck(this.sell.price, limitPricePrecision)
      this.keysellCheck()
    },
    sellNumberKeyup () {
      let limitVolumePrecision = this.currInfo.currCoin.limitVolumePrecision
      this.sell.number = Tool.numberCheck(this.sell.number, limitVolumePrecision)
      this.keysellCheck()
    },
    keyBuyCheck () {
      let assert = this.checkUserInfo()
      this.totalBuyPrice = Tool.decimal(this.buy.price, this.buy.number, 'mul')
      if (this.buy.number > 0 && this.buy.price > 0 && assert) {
        if (parseFloat(this.buy.number) < assert.buyAvailable) {
          this.buy_status = 2
        } else {
          this.buy_status = 0
        }
      }
    },
    keysellCheck () {
      let assert = this.checkUserInfo()
      this.totalSellPrice = Tool.decimal(this.sell.price, this.sell.number, 'mul')
      if (this.sell.number > 0 && this.sell.price > 0 && assert) {
        if (parseFloat(this.sell.number) < assert.sellAvailable) {
          this.sell_status = 2
        } else {
          this.sell_status = 0
        }
      }
    },
    async buyFn(str) {
      let symbol = this.currInfo.baseCoin + this.currInfo.quoteCoin
      let param
      if (str === 'buy') {
        if (this.type === 'markt' && this.currInfo.currCoin.marketVolumeMin !== null) {
          if (this.totalBuyPrice < this.currInfo.currCoin.marketVolumeMin) {
            this.$prompt.error('市价最小交易金额为' + this.currInfo.currCoin.marketVolumeMin)
          }
        }
        if (this.buy_status !== 2) return
        this.buy_status = 1
        param = {
          bilianHisId: this.currInfo.exchangeId,
          type: this.type === 'limit' ? 'BUY_LIMIT' : 'BUY_MARKET',
          amount: this.buy.number,
          symbol: symbol,
          price: this.type === 'markt' ? '' : this.buy.price
        }
      } else {
        if (this.type === 'markt' && this.currInfo.currCoin.marketVolumeMin !== null) {
          if (this.totalSellPrice < this.currInfo.currCoin.marketVolumeMin) {
            this.$prompt.error('市价最小交易金额为' + this.currInfo.currCoin.marketVolumeMin)
          }
        }
        if (this.sell_status !== 2) return
        this.sell_status = 1
        param = {
          bilianHisId: this.currInfo.exchangeId,
          type: this.type === 'limit' ? 'SELL_LIMIT' : 'SELL_MARKET',
          amount: this.sell.number,
          symbol: symbol,
          price: this.type === 'markt' ? '' : this.sell.price
        }
      }
      let data = await api.entrust(param)
      if (str === 'buy') {
        this.buy_status = 0
      } else {
        this.sell_status = 0
      }
      this.sell_status = 0
      if (data.status === 200) {
        this.getUserAsset()
        this.$parent.$refs.myEntrustListRef.toPage(1)
      } else {
        this.$prompt.error(data.message)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../../style/var";
@import "../../../style/form";
.entrust{
  margin-top:34px;
  width:100%;
  display:flex;
  flex-wrap: wrap-reverse;
  >div{
    flex:1;
    >a:nth-child(1) {
      display:block;
      text-align: center;
      height:45px;
      line-height: 45px;
    }
    >div:nth-child(2) {
      height:369px;
      background:@bg_color;
    }
  }
  .limit{
    background-color: #273c6c;
    border-top-right-radius: 50px;
  }
  .clickBtn{
    cursor: pointer;
    color:@click_color;
  }
  .gray{
    color:#4e5b85;
  }
  .markt{
    background-color: #273c6c;
    border-top-left-radius: 50px;
  }
  .praceInput{
    padding-top:22px;
    padding-left:17px;
    >div:nth-child(1) {
      width:100%;
      padding:0px 50px 0px 35px;
      position:relative;
      span{
        position:absolute;
        height:50px;
        line-height: 50px;
      }
      >span:nth-child(1){
        top:0px;
        left:0px;

      }
      >span:nth-child(2) {
        top:0px;
        right:60px;
        height:50px;
      }
      input{
        width: 100%;
        height: 50px;
        background-color: #273c6e;
        border-radius: 8px;
        border: solid 2px #304a87;
        margin-left:5px;
        padding-left:15px;
        padding-right:80px;
        color:#fff;
        font-size:16px;
      }
    }
    p{
      padding-left:35px;
      color: #688bdb;
      font-size:14px;
      margin:7px 0 0 0;
    }
    .process{
      height:2px;
      background:#3362d6;
      margin-top:40px;
      margin-left:40px;
      margin-right: 50px;
      position:relative;
      span:nth-child(1){
        width:12px;
        height:12px;
        position:absolute;
        border-radius: 50%;
        border: solid 2px #3362d6;
        left:0px;
        top:-5px;
        background:@index_bg;
      }
      span:nth-child(2){
        width:12px;
        height:12px;
        position:absolute;
        border-radius: 50%;
        border: solid 2px #3362d6;
        left:33.4%;
        top:-5px;
        background:@index_bg;
      }
      span:nth-child(3){
        width:12px;
        height:12px;
        position:absolute;
        border-radius: 50%;
        border: solid 2px #3362d6;
        left:66.8%;
        top:-5px;
        background:@index_bg;
      }
      span:nth-child(4){
        width:12px;
        height:12px;
        position:absolute;
        border-radius: 50%;
        border: solid 2px #3362d6;
        left:100%;
        top:-5px;
        background:@index_bg;
      }
      span{
        width:12px;
        height:12px;
        position:absolute;
        border-radius: 50%;
        border: solid 2px #3362d6;
        left:-5px;
        top:-5px;
        background:@index_bg;
      }
      /*>i{
        width:10px;
        height:10px;
        border-radius: 50%;
        border: solid 2px #3362d6;
        display:inline-block;
        margin-top:3px;
        vertical-align: -3px;
      }
      >span{
        background-color: #3463d7;
        height:2px;
        width:54px;
        display:inline-block;
      }*/
    }
  }
  .totalPrice{
    font-size: 16px;
    margin-top:40px;
    color:#fff;
    text-align: center;
  }
  .buyBtn{
    width: 276px;
    height: 44px;
    border-radius: 93px;
    text-align: center;
    line-height: 44px;
    font-size: 16px;
    display:block;
    margin:10px auto 0px;
  }
}
</style>
