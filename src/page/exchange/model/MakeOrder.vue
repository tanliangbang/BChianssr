<template>
  <div class="businessesDetail" v-if="currBusinesses!==null" v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
    <div class="header">
      <div>
        <p>使用人民币购买BITCNY资产</p>
      </div>
      <div>
        <p>通过火币网</p>
      </div>
      <div></div>
    </div>

    <section>
      <div>
        <div>
          {{$t("lang.otc.buyInfo")}}
        </div>
        <div class="leftContent">
          <div>
            <p>{{$t("lang.otc.merchant")}}:</p>
            <p>{{$t("lang.otc.price")}}:</p>
            <p>{{$t("lang.otc.volume")}}:</p>
            <p>{{$t("lang.otc.oPaymenthod")}}:</p>
            <p>{{$t("lang.otc.oLimits")}}:</p>
            <p>{{$t("lang.otc.exchange")}}:</p>
            <p>{{$t("lang.otc.timeLimit")}}:</p>
          </div>
          <div>
            <p>{{currBusinesses.name}}</p>
            <p>{{currBusinesses.price}}</p>
            <p>{{99999}}</p>
            <p>
              <em v-for="item in currBusinesses.payMode.split(',')">
                {{item === 'EBANK' ? '银行卡' : ''}}
                {{item === 'ALIPAY' ? '支付宝' : ''}}
                {{item === 'WEIXIN' ? '微信' : ''}}
              </em>
            </p>
            <p>{{currBusinesses.minLimit+"-"+currBusinesses.maxLimit}}</p>
            <p>{{currBusinesses.bilianHisName}}</p>
            <p>{{currBusinesses.tradeDeadline}}分钟</p>
          </div>
        </div>
      </div>

      <div>
        <div>
          {{$t("lang.otc.payInfo")}}
        </div>
        <div class="rightContent">
          <div>
            <span>{{this.decrection==="BUY"?$t("lang.otc.buyPrice"):$t("lang.otc.sellPrice")}}</span>
            <div>
              <div><input v-on:keyup="countNumber()" v-model="price"/> <span v-on:click="all()">全部</span></div>
              <p :class="priceError.show?'':'hideOpacity'" >{{priceError.content}}</p>
            </div>
            <span>BITCNY</span>
          </div>
          <div>
            <span>{{this.decrection==="BUY"?$t("lang.otc.buyAmount"):$t("lang.otc.sellAmount")}}</span>
            <div>
              <div><input v-on:keyup="countPrice()" v-model="number"/> <span v-on:click="all()">全部</span></div>
              <p :class="numberError.show?'':'hideOpacity'">{{numberError.content}}</p>
            </div>
            <span>BTC</span>
          </div>
          <div>
            <span>{{$t("lang.otc.leaveWord")}}</span>
            <textarea v-model="detail" />
            <span></span>
          </div>
          <div>
            <a v-on:click="submit" :class="submitStatus===2?'ok_button btn':'no_button btn'">
              <span v-if="submitStatus===0||submitStatus===2">{{this.decrection==='BUY'?$t("lang.exchange.mbuy"):$t("lang.exchange.msell")}}</span>
              <img v-if="submitStatus===1" src="../../../../static/img/loading.png" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>`

<script>
import * as api from '../../../service/getData'
import Tool from '../../../utils/Tool'
export default {
  name: 'MakeOrder',
  components: {
  },
  data () {
    return {
      number: '',
      price: '',
      detail: '',
      currBusinesses: null,
      submitStatus: 0,
      decrection: null,
      quoteCoin: null,
      quoteAsset: null,
      priceError: {
        show: false,
        content: ''
      },
      numberError: {
        show: false,
        content: ''
      }
    }
  },
  mounted () {
    let makeOrderParam = JSON.parse(Tool.localItem('makeOrderParam'))
    this.decrection = makeOrderParam.decrection
    this.quoteCoin = makeOrderParam.quoteCoin
    this.currBusinesses = makeOrderParam.currBusinesses
    if (this.decrection === 'SELL') {
      this.getAssert()
    }
  },
  methods: {
    countPrice () {
      this.number = Tool.numberCheck(this.number, 15)
      if (this.number === '') {
        this.price = ''
        return
      }
      this.price = Tool.decimal(this.number, this.currBusinesses.price, 'mul')
      this.judgeError()
    },
    async getAssert() {
      let data = await api.getUserAsset()
      for (let i = 0; i < data.data.length; i++) {
        if (parseInt(data.data[i].bilianHisId) === this.currBusinesses.bilianHisId) {
          for (let j = 0; j < data.data[i].hisUserBalanceCurrencyList.length; j++) {
            if (data.data[i].hisUserBalanceCurrencyList[j].currency === this.quoteCoin.toUpperCase()) {
              this.quoteAsset = parseFloat(data.data[i].hisUserBalanceCurrencyList[j].trade)
            }
          }
        }
      }
    },
    countNumber () {
      this.price = Tool.numberCheck(this.price, 15)
      if (this.price === '') {
        this.number = ''
        return
      }
      this.number = Tool.decimal(this.price, this.currBusinesses.price, 'div')
      this.judgeError()
    },
    all () {
      this.number = this.currBusinesses.maxLimit
      this.price = Tool.decimal(this.number, this.currBusinesses.price, 'mul')
      this.judgeError()
    },
    judgeError () {
      let price = parseFloat(this.price)
      let minPrice = Tool.decimal(this.currBusinesses.minLimit, this.currBusinesses.price, 'mul')
      let maxPrice = Tool.decimal(this.currBusinesses.maxLimit, this.currBusinesses.price, 'mul')
      if (this.decrection === 'SELL') {
        if (price > Tool.decimal(this.quoteAsset, this.currBusinesses.price, 'mul')) {
          this.priceError.show = true
          this.submitStatus = 0
          this.priceError.content = '账号最多能卖出' + Tool.decimal(this.quoteAsset, this.currBusinesses.price, 'mul') + 'CNY'
          return
        }
      }
      if (price < minPrice) {
        this.priceError.show = true
        this.numberError.show = true
        this.submitStatus = 0
        this.priceError.content = '最小交易金额为' + minPrice + 'CNY'
        this.numberError.content = '最小交易数量为' + this.currBusinesses.minLimit + 'BITCNY'
      } else if (price > maxPrice) {
        this.priceError.show = true
        this.numberError.show = true
        this.submitStatus = 0
        this.priceError.content = '最大交易金额为' + maxPrice + 'CNY'
        this.numberError.content = '最大交易数量为' + this.currBusinesses.maxLimit + 'BITCNY'
      } else {
        this.submitStatus = 2
        this.priceError.show = false
        this.priceError.content = ''
        this.numberError.show = false
        this.numberError.content = ''
      }
    },
    async submit () {
      this.submitStatus = 1
      let data = await api.makeOtcOrder({
        bilianHisId: this.currBusinesses.bilianHisId,
        payType: 'EBANK',
        quoteCurrency: this.quoteCoin,
        type: this.decrection,
        price: this.currBusinesses.price,
        num: this.number
      })
      if (data.status === 200) {
        this.submitStatus = 0
        Tool.localItem('orderDetail', JSON.stringify(data.data))
        this.$router.push('orderDetail')
      } else {
        this.submitStatus = 2
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../../style/var";
@import "./index";
@import "../../../style/form";
  .rightContent{
    >div{
      margin-bottom:12px;
      text-align: center;
      >span:nth-child(1) {
        width:80px;
        color: #a8c1ff;
        text-align: right;
        display:inline-block;
        margin-right:18px;
        height:48px;
        line-height: 48px;
        top:0px;
      }
      >span:nth-child(3) {
        display:inline-block;
        width:50px;
        text-align: left;
      }
      textarea{
        width: 425px;
        background-color: #273c6e;
        height:175px;
        border:none;
        border-radius: 8px;
        vertical-align: top;
        margin-right:18px;
        padding-left:15px;
        padding-top:10px;
        color:#fff;
      }
      >div:nth-child(2) {
        margin-right:18px;
        display:inline-block;
        vertical-align: top;
        width: 425px;
        >div{
          height: 48px;
          background-color: #273c6e;
          position:relative;
          border-radius: 8px;
        }
        p{
          text-align: left;
          color:#ed3f14;
          padding-left:5px;
          margin-top:5px;
        }
        input{
          width:100%;
          height:100%;
          background:none;
          border:none;
          padding-left:15px;
          color:#fff;
          vertical-align: top;
        }
        span{
          position:absolute;
          right:10px;
          top:12px;
          color: #0088ff;
          cursor: pointer;
        }
      }
    }
  }
  .btn{
    display:inline-block;
    width: 310px;
    height: 45px;
    margin-top:30px;
    line-height: 45px;
    border-radius: 93px;
  }
</style>
