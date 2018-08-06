<template>
  <div class="businessesDetail" v-if="currOrder!==null" v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
    <div class="header">
      <div>
        <p>使用人民币购买{{currOrder.quoteCurrency.toUpperCase()}}资产</p>
      </div>
      <div>
        <p>通过火币网</p>
      </div>
      <div>
        <a v-if="currOrder.orderStatus === 'UNFINISHED'" v-on:click="cancelOrder" class="cancelOrder opera-btn">
          {{$t("lang.otc.cancelOrder")}}
        </a>
        <a v-if="status ===2" class="apply-btn opera-btn">申诉</a>
      </div>
    </div>

    <section>
      <div>
        <div>
          {{$t("lang.otc.buyInfo")}}
        </div>
        <div class="leftContent">
          <div>
            <p>{{$t("lang.otc.orderNum")}}:</p>
            <p>{{$t("lang.otc.direction")}}:</p>
            <p>{{$t("lang.otc.volume")}}:</p>
            <p>{{$t("lang.otc.price")}}:</p>
            <p>{{$t("lang.otc.free")}}:</p>
            <p>{{$t("lang.otc.totalPrice")}}:</p>
            <p>{{$t("lang.otc.exchange")}}:</p>
          </div>
          <div>
            <p>{{currOrder.cardCode}}</p>
            <p>{{currOrder.type==='BUY'?$t("lang.otc.buy"):$t("lang.otc.sell")}}</p>
            <p>{{currOrder.num+' '+currOrder.quoteCurrency.toUpperCase()}}</p>
            <p>{{currOrder.price}}</p>
            <p>{{currOrder.fee}}</p>
            <p>{{currOrder.totalCost}}</p>
            <p>{{currOrder.bilianHisName}}</p>
          </div>
        </div>
      </div>

      <div>
        <div>
          {{$t("lang.otc.payInfo")}}
        </div>
        <div class="rightContent">
          <div>
            <span>{{$t("lang.otc.memo")}}:</span>
            <span>{{currOrder.memo}} <em class="redfont">({{$t("lang.otc.memoPrompt")}})</em></span>
          </div>
          <div>
            <span>{{$t("lang.otc.bankCard")}}:</span>
            <span>{{currOrder.cardUserName +" "+ currOrder.cardCode +" "+ currOrder.cardAddress}}</span>
          </div>
          <div>
            <span>{{$t("lang.otc.alipay")}}:</span>
            <span>{{currOrder.cardUserName + ' ' + currOrder.alipayId}}</span>
          </div>
          <div>
            <span>{{$t("lang.otc.weiXin")}}:</span>
            <span>{{currOrder.cardUserName + ' ' + currOrder.weixinName}}</span>
          </div>
          <div v-if="status === 0">
            <span></span>
            <span>已取消</span>
          </div>
          <div v-if="status === 1">
            <span>{{$t("lang.otc.needPay")}}:</span>
            <span>80000元,请在<i>59分36</i>秒完成支付</span>
          </div>
          <div v-if="status === 2">
            <span></span>
            <span>已支付</span>
          </div>
          <div v-if="currOrder.orderStatus === 'CANCELED'">
            <span></span>
            <a class="payed btn" >订单已被取消 </a>
          </div>
          <div v-if="currOrder.orderStatus === 'UNFINISHED'">
            <span></span>
            <a class="paing btn" v-on:click="submit">确认已支付￥8000 </a>
          </div>
          <div v-if="currOrder.orderStatus === 'aa'">
            <span></span>
            <a class="payed btn" v-on:click="payed">已支付,待卖家确认收款 </a>
          </div>
          <div>
            <span></span>
            <div v-if="currOrder.orderStatus === 'FINISHED'" class="finish">
              <img src="../../../../static/img/img_wallet.png">
              卖家已确认收款,数字货币已入账请查收您的数字货币账户
            </div>
          </div>
          <div v-if="currOrder.orderStatus === 'UNFINISHED'">
            <span></span>
            <span>未完成支付请勿点击确认,否则将影响你的记录</span>
          </div>
          <p class="careful">
            <span>{{$t("lang.otc.prompt1")}}</span>
            <span>{{$t("lang.otc.prompt2")}}</span>
            <span>{{$t("lang.otc.prompt3")}}</span>
            <span>{{$t("lang.otc.prompt4")}}</span>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Tool from '../../../utils/Tool'
import * as api from '../../../service/getData'
export default {
  name: 'OrderInfo',
  components: {
  },
  data () {
    return {
      status: 1,
      currOrder: null
    }
  },
  mounted () {
    console.log(JSON.parse(Tool.localItem('orderDetail')))
    this.currOrder = JSON.parse(Tool.localItem('orderDetail'))
  },
  methods: {
    submit () {
      this.status = 2
    },
    payed () {
      this.status = 3
    },
    cancelOrder () {
      let _this = this
      this.$mask.showAlert('确定要取消订单么？', 'doubt', function () {
        _this.status = 1
        let param = {}
        console.log(_this.currOrder)
        api.cancelOtcOrder(param).then(() => function () {
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../../style/var";
@import "./index";
.leftContent{
  p{
    line-height:35px;
    >span {
      display:inline-block;
      width:130px;
      text-align: left;
    }
  }
}
.rightContent {
  padding: 0px 20%;
  border: 1px solid @mainColor;
  > div {
    margin-bottom: 17px;
    span:nth-child(1) {
      width: 120px;
      text-align: left;
      font-size: 16px;
      display: inline-block;
    }
    span:nth-child(2) {
      text-align: left;
      display: inline-block;
    }
  }
}
.btn{
  width: 346px;
  height: 50px;
  border-radius: 93px;
  display:inline-block;
  line-height: 50px;
  margin:38px auto 0px;
  cursor: pointer;
  text-align: center;
}
.finish{
  display:inline-block;
  width:446px;
  height:108px;
  margin-top:50px;
  background:@bg_color;
  padding-left:127px;
  padding-top:35px;
  padding-right:25px;
  position:relative;
  border-radius: 12px;
  img{
    position:absolute;
    top:-35px;
    left:25px;
  }
}
.paing{
  background-color: #4177fc;
}
.payed{
  background-color: @bg_color;
}
.careful{
  margin:50px 0px;
  span{
    margin-bottom:5px;
    display:block;
    color: #a9c2fd;
    font-size:12px;
  }
}
.header{
  width:100%;
  height:80px;
  background-color:@mainColor;
  display:flex;
  flex-wrap: wrap-reverse;
  >div{
    flex:1;
    line-height: 80px;
  }
  >div:nth-child(1) {
    padding-left:30px;
    p{
      font-size:18px;
    }
  }
  >div:nth-child(2) {
    text-align: center;
    p{
      font-size:18px;
    }
  }
  >div:nth-child(3) {
    position:relative;
    .opera-btn {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      position:absolute;
      top:20px;
      right:30px;
      color:#fff;
      border-radius: 8px;
      cursor:pointer;
    }

    .cancelOrder{
      background-color: #e24d4d;
    }
    .apply-btn{
      background-color:#4d5de2;
    }
  }
}
</style>
