<template>
  <div class="assetManage mainMg" v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
    <RechargeAndEnchashment ref="reEn"/>
    <div class="asset-header" v-if="currAssert">
      <div>
        <div>{{$t("lang.assertManage.today")}}</div>
        <div>
          <span class="raise">{{currAssert.allExchangesTodayRange * 100}}%</span>
          <span>{{currAssert.allExchangesTodayAsserts}}</span>
        </div>
        <div>{{$t("lang.assertManage.sumProfit")}}</div>
        <div>
          <span class="raise">{{currAssert.allExchangesRange * 100}}%</span>
          <span>{{currAssert.allExchangesChange}}</span>
        </div>
      </div>

      <div>
         <span>{{currAssert.allExchangesAsserts}}</span>
         <span>~254665585.23 CNY</span>
         <span>{{$t("lang.assertManage.totalAccount")}}</span>
      </div>
    </div>

    <div class="asset-coin-list">
      <div v-if="currAssert&&currExchange!==null">
        <ul>
          <li>{{$t("lang.assertManage.tradeAccount")}}</li>
          <li v-for="(item, index) in currAssert['exchanges']" v-on:click="changeExchange(item.bilianHisId)" :class="currExchange.bilianHisId===item.bilianHisId?'selected':'pointer'" :key="index">{{item.bilianHisName}}</li>
        </ul>
      </div>

      <div class="scrollStyle">
          <div v-if="currExchange!==null" >
            <span>{{currExchange.bilianHisName}}</span>
            <span><i>{{$t("lang.assertManage.today")}}</i> {{currExchange.todayHisRange}}</span>
            <span><i>{{$t("lang.assertManage.assets")}}</i> {{currExchange.totalAssert}}</span>
            <span><router-link to="financeRecord">{{$t("lang.assertManage.financialRecord")}}</router-link></span>
          </div>
          <table cellspacing="0" v-if="currExchange!==null" >
            <tr><th></th><th>{{$t("lang.assertManage.coinName")}}</th><th>{{$t("lang.assertManage.available")}}</th><th>{{$t("lang.assertManage.frozen")}}</th><th colspan="2">{{$t("lang.assertManage.control")}}</th><th></th></tr>
            <tr  v-for="(item, index) in currExchange['hisUserBalanceCurrencyList']" v-if="" :key="index"><td></td><td>{{item.currency}}</td><td>{{item.trade}}</td><td>{{item.frozen}}</td><td><a v-on:click="recharge">{{$t("lang.assertManage.deposit")}}</a></td><td><a v-on:click="enchashment">{{$t("lang.assertManage.withdraw")}}</a></td><td></td></tr>
          </table>
      </div>
    </div>
  </div>
</template>

<script>
import RechargeAndEnchashment from './model/RechargeAndEnchashment'
import { mapGetters } from 'vuex'
export default {
  name: 'AssetManage',
  components: {
    RechargeAndEnchashment
  },
  data () {
    return {
      currExchange: null
    }
  },
  computed: {
    ...mapGetters({
      currAssert: 'getUserassert'
    })
  },
  async created () {
    await this.$store.dispatch('getUserassert')
    this.currExchange = this.currAssert.exchanges[0]
  },
  mounted () {
    window.scrollTo(0, 0)
  },
  methods: {
    recharge () {
      this.$refs.reEn.showEnRe(1)
    },
    enchashment () {
      this.$refs.reEn.showEnRe(2)
    },
    changeExchange(id) {
      let len = this.currAssert.exchanges.length
      for (let i = 0; i < len; i++) {
        if (this.currAssert.exchanges[i].bilianHisId === id) {
          this.currExchange = this.currAssert.exchanges[i]
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
 @import "../../style/var";
.assetManage{
  margin:30px 200px;
  background:@index_bg;
  .asset-header{
    height: 128px;
    border:1px solid  #274ca1;
    >div:nth-child(1){
      >div{
        float:left;
      }
      >div:nth-child(1),div:nth-child(3){
        margin:44px 20px 59px 76px;
      }
      >div:nth-child(2),div:nth-child(4){
        margin-top:35px;
        margin-right:128px;
        >span{
          display:block;
        }
        >span:nth-child(1){
          font-size:26px;
        }
        >span:nth-child(2){
          font-size:14px;
          color: #a9c2fd;
        }
      }
    }

    >div:nth-child(2){
      float:right;
      margin-right:90px;
      >span{
        text-align: right;
        display:block;
      }
      >span:nth-child(1){
        margin-top:22px;
        font-size: 30px;
      }
      >span:nth-child(2){
        font-size:14px;
        color: #a9c2fd;
      }
      >span:nth-child(3){
        font-size:16px;
        color: #a9c2fd;
      }
    }
  }

  .asset-coin-list{
    height:658px;
    margin-top:15px;
    display:flex;
    flex-wrap: wrap-reverse;
    >div:nth-child(1){
      background:@bg_color;
      flex:3;
      margin-right:10px;
      ul{
        li:nth-child(1){
          line-height: 90px;
        }
        li{
          line-height: 60px;
          text-align: center;
          font-size:18px;
        }
        .selected{
          background-color: #284585;
          border-left:10px solid #0087ff;
        }
      }
    }
    >div:nth-child(2){
      flex:7;
      background:@bg_color;
      overflow-y:auto;
      >div:nth-child(1){
        margin:0px 48px;
        display:flex;
        flex-wrap: wrap-reverse;
        >span{
          flex:1;
          line-height: 90px;
          text-align: center;
        }
        >span:nth-child(4){
          cursor: pointer;
          a{
            color: #269aff;
          }
        }
      }
      table{
        width:100%;
        th{
          text-align: left;
          background:#284585;
        }
        td{
          background:#274075;
        }
        td,th{
          line-height: 60px;
          border-bottom:1px solid @index_bg;
        }
        th:nth-child(5){
          text-align: center;
        }
        td:nth-child(5),td:nth-child(6){
          text-align: center;
          color:#00eeff;
          cursor: pointer;
        }
        td:nth-child(1),th:nth-child(1){
          width:130px;
        }
        td:last-child,th:last-child{
          width:130px;
        }
      }
    }
  }
}
.pointer{
  cursor:pointer;
}
</style>
