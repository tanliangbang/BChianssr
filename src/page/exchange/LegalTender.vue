<template>
  <div class="legalTender mainMg">
     <section>
       <header>
           <div>
              <div>
                <a :class="currType==='BUY'?'selected':'unselected'" v-on:click="changeType('BUY')">{{$t("lang.exchange.mbuy")}}</a>
                <a :class="currType==='BUY'?'unselected':'selected'" v-on:click="changeType('SELL')">{{$t("lang.exchange.msell")}}</a>
              </div>
           </div>
           <div>
             <span class="selected">BITCNY</span>
           </div>
       </header>
       <div class="exList">
         <table border="0" cellpadding="0" cellspacing="0">
           <thead>
             <tr>
               <th width="20%">{{$t("lang.otc.merchant")}}</th>
               <th width="15%">{{$t("lang.otc.volume")}}</th>
               <th width="15%">{{$t("lang.otc.limits")}}</th>
               <th width="15%" >{{$t("lang.otc.price")}}</th>
               <th width="15%">{{$t("lang.otc.paymenthod")}}</th>
               <th width="10%">{{$t("lang.otc.exchange")}}</th>
               <th width="10%">{{$t("lang.otc.control")}}</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="(item, index) in businessesList" :key="index">
               <td>{{item.name}}</td>
               <td>{{99999}}</td>
               <td>{{item.minLimit+"-"+item.num}}</td>
               <td>{{item.price}}</td>
               <td>
                 <img v-for="payfor in item.payMode.split(',')" v-if="item.payMode.split(',')[0]" :src="'../../../static/img/' + payfor + '.png'">
               </td>
               <td>{{item.bilianHisName}}</td>
               <td><a class="showExchagne" v-on:click="makeOrder(item)">{{$t("lang.otc.goTrade")}}</a></td>
             </tr>
           </tbody>
         </table>
         <div>
            <span>{{$t("lang.common.prePage")}}</span>
            <span>06/10</span>
            <span>{{$t("lang.common.nextPage")}}</span>
         </div>
       </div>

       <div class="myOrder">
         <header>
           <span>{{$t("lang.otc.myOrder")}}</span>
           <div class="search">
             <input type="text" placeholder="订单号/日期/状态/对手方">
             <button>{{$t("lang.otc.search")}}</button>
           </div>
         </header>

         <table border="0" cellpadding="0" cellspacing="0">
           <thead>
             <tr>
               <th width="12%">{{$t("lang.otc.orderNum")}}</th>
               <th width="10%">{{$t("lang.otc.direction")}}</th>
               <th width="10%">{{$t("lang.otc.coin")}}</th>
               <th width="12%">{{$t("lang.otc.amount")}}</th>
               <th width="12%">{{$t("lang.otc.free")}}</th>
               <th width="12%">{{$t("lang.otc.totalPrice")}}</th>
               <th width="14%">{{$t("lang.otc.time")}}</th>
               <th width="8%">{{$t("lang.otc.state")}}</th>
               <th width="10%">{{$t("lang.otc.counterparty")}}</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="item in myOtcOrderList" v-on:click="showOrderInfo(item)" >
               <td>{{item.bilianOrderId}}</td>
               <td>{{item.type==='BUY'?'买入':'卖出'}}</td>
               <td>{{item.quoteCurrency.toUpperCase()}}</td>
               <td>{{item.num}}</td>
               <td>{{item.fee}}</td>
               <td>{{item.totalCost}}</td>
               <td>{{item.createAt}}</td>
               <td>{{item.orderStatusChina}}</td>
               <td>{{item.cardUserName}}</td>
             </tr>
           </tbody>
         </table>
       </div>
     </section>
  </div>
</template>

<script>
import * as api from '../../service/getData'
import Tool from '../../utils/Tool'
export default {
  name: 'LegalTender',
  components: {
  },
  data () {
    return {
      currType: 'BUY',
      businessesList: null,
      myOtcOrderList: null
    }
  },
  created () {
    this.getBusinessesList()
    this.getMyOtcOrderList()
  },
  mounted () {
    window.scrollTo(0, 0)
  },
  methods: {
    makeOrder (item) {
      let makeOrderParam = {
        currBusinesses: item,
        quoteCoin: 'bitcny',
        decrection: this.currType
      }
      Tool.localItem('makeOrderParam', JSON.stringify(makeOrderParam))
      this.$router.push('makeOrder')
    },
    async getBusinessesList () {
      let data = await api.getOrderList({type: this.currType, quoteCurrency: 'bitcny', pageIndex: 0, pageSize: 10})
      this.businessesList = data.data
    },
    async getMyOtcOrderList() {
      let myOtcOrderList = await api.myOtcOrderList()
      myOtcOrderList = myOtcOrderList.data
      for (let i = 0; i < myOtcOrderList.length; i++) {
        myOtcOrderList[i].createAt = Tool.formatDate2(myOtcOrderList[i].createAt, '/')
        myOtcOrderList[i].orderStatusChina = Tool.changeOtcStatus(myOtcOrderList[i].orderStatus)
      }
      this.myOtcOrderList = myOtcOrderList
    },
    showOrderInfo (currOrder) {
      Tool.localItem('orderDetail', JSON.stringify(currOrder))
      this.$router.push('orderDetail')
    },
    changeType (str) {
      this.currType = str
      this.getBusinessesList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./../../style/common";
@import "./index";
.showExchagne {
  cursor: pointer;
  position:relative;
  color:#0088ff;
}
header{
  margin-top:50px;
  >div:nth-child(1) {
    >div{
      display:flex;
      flex-wrap: wrap-reverse;
      width:524px;
      a:nth-child(1) {
        border-top-left-radius: 8px;
      }
      a:nth-child(2) {
        border-top-right-radius: 8px;
      }
      >a{
        flex:1;
        text-align: center;
        height:50px;
        line-height: 50px;
        cursor: pointer;
      }
      .selected{
        background-color: #284da1;
        color:#fff;
      }
      .unselected{
        border: solid 1px #5a78bf;
      }
    }
  }
  >div:nth-child(2) {
    height: 70px;
    background-color: #283c6c;
    line-height: 70px;
    margin-top:18px;
    margin-bottom:10px;
    >span{
      display:inline-block;
      cursor: pointer;
      width: 120px;
      text-align: center;
      font-size:18px;
    }
    .selected{
      background-color: #284da1;
    }
  }
}
</style>
