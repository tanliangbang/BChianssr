<template>
  <div class="entrustManage mainMg" v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
      <div class="header">
         <div>
             <a v-on:click="changeStatus(1)" :class="status===1?'selected':''">{{$t("lang.entrustManage.processContracts")}}</a>
             <a v-on:click="changeStatus(2)" :class="status===2?'selected':''">{{$t("lang.entrustManage.historyContracts")}}</a>
         </div>
        <div class="search">
           <input type="checkbox">{{$t("lang.entrustManage.onlyShowFinished")}}
           <input type="text">
           <button>{{$t("lang.entrustManage.search")}}</button>
        </div>
      </div>
      <EntrustList ref="entrustList" v-bind:pagination = 'pagination' v-bind:entrustList = 'entrustList'/>

  </div>
</template>

<script>
import * as api from '../../service/getData'
import Tool from '../../../src/utils/Tool'
import EntrustList from '../../components/entrust/EntrustList'
export default {
  name: 'EntrustManage',
  components: {
    EntrustList
  },
  data () {
    return {
      status: 1,
      entrustList: null,
      pagination: {
        current: 1,
        total: 0,
        totalSize: 0,
        onShowSizeChange: this.getCurrDate,
        onChange: null
      }
    }
  },
  created () {
  },
  mounted () {
    window.scrollTo(0, 0)
    this.$refs.entrustList.toPage(1)
  },
  methods: {
    changeStatus (num) {
      this.status = num
      this.$refs.entrustList.toPage(1)
    },
    decimal (a, b, opera) {
      if (a > 0 && b > 0) {
        return Tool.decimal(a, b, opera)
      } else {
        return '无'
      }
    },
    async getCurrDate(currpage, pageSize) {
      let param = {
        types: 'BUY_MARKET,SELL_MARKET,BUY_LIMIT,SELL_LIMIT',
        pageSize: pageSize,
        pageIndex: (currpage - 1) * pageSize
      }
      if (this.status === 1) {
        param.states = 'NEW,PARTIAL_FILLED'
      } else {
        param.states = 'FILLED,CANCELED'
      }
      let entrustList = await api.getEntrustListAll(param)
      this.pagination.totalSize = entrustList.total
      entrustList = entrustList.data
      let state, way
      for (let i = 0; i < entrustList.length; i++) {
        entrustList[i].createdAt = Tool.formatDate2(entrustList[i].createdAt, '/')
        state = entrustList[i].state
        way = entrustList[i].type
        entrustList[i].typeChina = Tool.buyAndSellChange(way)
        entrustList[i].stateStr = Tool.stateChange(state)
        console.log(entrustList[i].price, entrustList[i].amount)
        entrustList[i].totalPrice = Tool.decimal(entrustList[i].price, entrustList[i].amount, 'mul')
        if (entrustList.state === 'PARTIAL_FILLED' || entrustList.state === 'FILLED') {
          entrustList[i].averagePrice = Tool.decimal(entrustList.fieldCashAmount, entrustList.fieldAmount, 'mul')
        } else {
          entrustList[i].averagePrice = '--'
        }
      }
      this.entrustList = entrustList
    },
    async cancelEntrust(item) {
      let data = await api.cancelEntrust({
        bilianHisId: item.bilianHisId,
        bilianOrderId: item.bilianOrderId,
        hisOrderId: item.orderId,
        symbol: item.symbol
      })
      if (data.status === 200) {
        item.stateStr = '已撤销'
        item.state = 'CANCELED'
      } else {
        this.$prompt.error(data.message)
      }
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
      margin-bottom:20px;
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
      .search{
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
          background:url('../../../static/img/checked.png')
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
  .opera{
    color:@click_color;
    cursor:pointer;
  }
</style>
