<template>
  <div class="entrustManage mainMg" v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
      <div class="header">
         <div>
             <a v-on:click="changeStatus(1)" :class="status===1?'selected':''">{{$t("lang.entrustManage.processContracts")}}</a>
             <a v-on:click="changeStatus(2)" :class="status===2?'selected':''">{{$t("lang.entrustManage.historyContracts")}}</a>
         </div>
        <div class="opera">
           <input type="checkbox">{{$t("lang.entrustManage.onlyShowFinished")}}
           <input type="text">
           <button>{{$t("lang.entrustManage.search")}}</button>
        </div>
      </div>

      <table cellspacing="0" class="entrustTable">
        <thead>
          <tr>
            <th width="13%">{{$t("lang.entrustManage.time")}}</th>
            <th width="10%">{{$t("lang.entrustManage.direction")}}</th>
            <th width="10%"> {{$t("lang.entrustManage.coinType")}}</th>
            <th width="10%">{{$t("lang.entrustManage.price")}}</th>
            <th width="10%">{{$t("lang.entrustManage.volume")}}</th>
            <th width="11%">{{$t("lang.entrustManage.contractValue")}}</th>
            <th width="10%">{{$t("lang.entrustManage.status")}}</th>
            <th width="10%">{{$t("lang.entrustManage.averagePrice")}}</th>
            <th width="10%">{{$t("lang.entrustManage.exchange")}}</th>
            <th width="6%">{{$t("lang.entrustManage.control")}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="entrustList!==null" v-for="item in entrustList">
            <td>{{item.createdAt}}</td>
            <td>{{item.symbol.toUpperCase()}}</td>
            <td :class="item.type === 'BUY_MARKET' || item.type === 'BUY_LIMIT' ? 'buyColor':'sellColor'">{{item.typeChina}}</td>
            <td>{{item.type.split('_')[1] === 'MARKET'?'无':item.price}}</td>
            <td>{{item.type.split('_')[1] === 'MARKET'?'无':item.amount}}</td>
            <td>{{decimal(item.price, item.amount, 'mul')}}</td>
            <td>{{item.stateStr}}</td>
            <td>{{item.state==='PARTIAL_FILLED' || item.state==='FILLED' ? item.fieldCashAmount/item.fieldAmount : '无'}}</td>
            <td>{{item.bilianHisName}}</td>
            <td>
              <a v-if="item.state!=='FILLED'&&item.state!=='CANCELED'" class="opera" v-on:click="cancelEntrust(item)">撤销</a>
              <a v-if="item.state==='FILLED'||item.state==='CANCELED'" >撤销</a>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
import * as api from '../../service/getData'
import Tool from '../../../src/utils/Tool'
export default {
  name: 'EntrustManage',
  components: {
  },
  data () {
    return {
      status: 1,
      entrustList: null
    }
  },
  created () {
    this.init()
  },
  mounted () {
    window.scrollTo(0, 0)
  },
  methods: {
    changeStatus (num) {
      this.status = num
      this.init()
    },
    decimal (a, b, opera) {
      if (a > 0 && b > 0) {
        return Tool.decimal(a, b, opera)
      } else {
        return '无'
      }
    },
    async init () {
      let param = {
        types: 'BUY_MARKET,SELL_MARKET,BUY_LIMIT,SELL_LIMIT'
      }
      if (this.status === 1) {
        param.states = 'NEW,PARTIAL_FILLED'
      } else {
        param.states = 'FILLED,CANCELED'
      }
      let entrustList = await api.getEntrustListAll(param)
      entrustList = entrustList.data
      let state, way
      for (let i = 0; i < entrustList.length; i++) {
        entrustList[i].createdAt = Tool.formatDate2(entrustList[i].createdAt, '/')
        state = entrustList[i].state
        way = entrustList[i].type
        entrustList[i].typeChina = Tool.buyAndSellChange(way)
        entrustList[i].stateStr = Tool.stateChange(state)
      }
      this.entrustList = entrustList
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../style/var";
  .entrustManage{
    padding:100px;
    font-size: 14px;
    .header {
      border-bottom: 1px solid #4177fc;
      height:50px;
      > div:nth-child(1) {
        width: 369px;
        height: 50px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        display: flex;
        float:left;
        flex-wrap: wrap-reverse;
        border: 1px solid #4177fc;
        border-bottom: none;
        .selected {
          background: #4177fc;
        }
        a:nth-child(1) {
          border-top-left-radius: 8px;
        }
        a:nth-child(2) {
          border-top-right-radius: 8px;
        }
        a {
          line-height: 50px;
          text-align: center;
          flex: 1;
          cursor: pointer;
        }
      }
      .opera{
        float:right;
        input[type^="checkbox"]{
          content:'';
          width:0px;
          height:0px;
          display:inline-block;
          position:relative;
          margin-right:20px;
        }
        input[type^="checkbox"]:after{
          content:'';
          top:-16px;
          left:-11px;
          width:22px;
          height:22px;
          position:absolute;
        //  background:url('../../../static/img/check.png')
        }
        input[type^="checkbox"]:checked:after{
          top:-16px;
          left:-11px;
          width:22px;
          height:22px;
          position:absolute;
        //  background:url('../../../static/img/checked.png')
        }
        input[type^="text"]{
          width: 216px;
          height: 36px;
          background-color: #273c6e;
          border-radius: 8px;
          border: solid 2px #304a87;
          margin-left:20px;
          margin-right:20px;
        }
        button{
          width: 88px;
          height: 36px;
          background-color: #4177fc;
          border-radius: 5px;
          line-height: 36px;
          text-align: center;
          border:none;
          color:#fff;
        }
      }
    }
  }

</style>
