<template>
  <div class="currEntrustList">
    <div v-if="currInfo.currCoin">
      {{$t("lang.exchange.lastPrice")}} {{currInfo.currCoin.tick.close}}
    </div>
    <div v-if="currInfo.currCoin">
      <div>
        <table cellpadding="0" cellspacing="0">
         <tr><th></th><th>{{$t("lang.exchange.price")}}({{currInfo.quoteCoin.toUpperCase()}})</th><th>{{$t("lang.exchange.amount")}}({{currInfo.baseCoin.toUpperCase()}})</th><th>{{$t("lang.exchange.sum")}}({{currInfo.baseCoin.toUpperCase()}})</th></tr>
         <tbody>
           <tr v-for="(item, index) in entrustList.asks" v-if="index<10" :key="index"><td>{{$t("lang.exchange.sell")}}{{index+1}}</td><td>{{dealPrice(item[0])}}</td><td>{{dealNum(item[1])}}</td><td>{{item[2]}}</td></tr>
         </tbody>
        </table>
      </div>
      <div>
        <table cellpadding="0" cellspacing="0">
          <tr><th></th><th>{{$t("lang.exchange.price")}}({{currInfo.quoteCoin.toUpperCase()}})</th><th>{{$t("lang.exchange.amount")}}({{currInfo.baseCoin.toUpperCase()}})</th><th>{{$t("lang.exchange.sum")}}({{currInfo.baseCoin.toUpperCase()}})</th></tr>
          <tbody>
            <tr v-for="(item, index) in entrustList.buys" v-if="index<10" :key="index"><td>{{$t("lang.exchange.buy")}}{{index+1}}</td><td>{{dealPrice(item[0])}}</td><td>{{dealNum(item[1])}}</td><td>{{item[2]}}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Tool from '../../../utils/Tool'
export default {
  name: 'CurrEntrustList',
  components: {
  },
  props: [
    'entrustList',
    'currInfo'
  ],
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    dealNum(num) {
      return Tool.intercept(num, this.currInfo.currCoin.limitVolumePrecision)
    },
    dealPrice(num) {
      return Tool.intercept(num, this.currInfo.currCoin.limitPricePrecision)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./../../../style/var";
  .currEntrustList{
    background:@bg_color;
    height:100%;
    >div:nth-child(1) {
      height:66px;
      line-height:66px;
      background:@bg_color;
      font-size:18px;
      color:#fff;
      padding-left:66px;
    }
    >div:nth-child(2) {
      display:flex;
      flex-wrap:wrap-reverse;
      th{
        text-align: left;
      }
      >div:nth-child(1) {
        table{
          tr{
            td:nth-child(2){
              color: #fafc68;
            }
          }
        }
      }
      >div:nth-child(2) {
        table{
          tr{
            td:nth-child(2){
              color: #00eeff;
            }
          }
        }
      }
      >div{
        flex:1;
        display:inline-block;
        table{
          width:100%;
          font-size:13px;
          tr{
            line-height: 45px;
            td:nth-child(1) {
              padding-left:20px;
            }
          }
          tr:nth-child(even) {
            background:@bg_color;
          }
          tr:nth-child(odd) {
            background:#273a67;
          }
        }
      }
    }
}
</style>
