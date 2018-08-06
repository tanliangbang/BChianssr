<template>
  <div class="financeRecord">
      <RechEnchDetail ref="rechEnchDetail"/>
      <div class="common-nav">
        <router-link to="assetManage">{{$t("lang.financeRecord.financeRecord")}}</router-link> >
        <i>{{$t("lang.financeRecord.exchangeRecord")}}</i>
      </div>
      <div :class="showSelect?'select show-select':'select hide-select'" v-on:click="changeSelect">
         全部
        <ul v-if="showSelect">
          <li>充币</li>
          <li>提币</li>
          <li>其它</li>
        </ul>
      </div>
    <table cellspacing="0">
      <tr>
        <th></th>
        <th>{{$t("lang.financeRecord.time")}}</th>
        <th>{{$t("lang.financeRecord.coinType")}}</th>
        <th>{{$t("lang.financeRecord.movement")}}</th>
        <th>{{$t("lang.financeRecord.volume")}}</th>
        <th>{{$t("lang.financeRecord.state")}}</th>
        <th>{{$t("lang.financeRecord.details")}}</th>
        <th></th>
      </tr>
      <tr v-for="item in [1,2,3,4,5,6,7,8,9]" :key="item">
        <td></td>
        <td>2018-05-16 17:28:35</td>
        <td>EOS</td>
        <td>提币</td>
        <td>155245</td>
        <td>完成</td>
        <td><a v-on:click="showDetail">详情</a></td>
        <td></td>
      </tr>
    </table>
    <div class="page">
       <a>上一页</a><span>返回</span><a>下一页</a>
    </div>
  </div>
</template>

<script>
import RechEnchDetail from './model/RechEnchDetail'
export default {
  name: 'FinanceRecord',
  components: {
    RechEnchDetail
  },
  data () {
    return {
      showSelect: false
    }
  },
  created () {
  },
  mounted () {
    window.scrollTo(0, 0)
  },
  methods: {
    changeSelect () {
      this.showSelect = !this.showSelect
    },
    showDetail () {
      this.$refs.rechEnchDetail.showEnReDetail()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../style/common";
.financeRecord{
  margin:0px 300px;
  position:relative;
  .select{
    width: 85px;
    height: 36px;
    background-color: #273c6e;
    border-radius: 8px;
    border: solid 2px #304a87;
    text-align: center;
    line-height: 32px;
    position:absolute;
    right:0px;
    top:30px;
    cursor: pointer;
    >ul{
      position:absolute;
      border: solid 1px #2f4780;
      width:142px;
      right:0px;
      top:34px;
      border-radius: 8px;
      line-height: 42px;
      overflow: hidden;
      li{
        font-size: 14px;
        background:@bg_color;
      }
      li:hover{
        background:@mainColor;
      }
    }
  }
  .hide-select:after{
    content:" ";
    width: 0;
    height: 0;
    position:absolute;
    top:13px;
    right:12px;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid #fff;
  }
  .show-select:after{
    content:" ";
    width: 0;
    height: 0;
    position:absolute;
    top:13px;
    right:12px;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6px solid #fff;
  }
  table{
    width:100%;
    line-height: 50px;
    margin-bottom:50px;
    font-size:14px;
    th{
      text-align: left;
      background:#284585;
      border-bottom:1px solid @index_bg;
    }
    td{
      background:#274075;
      border-bottom:1px solid @index_bg;
    }
    td:nth-child(1),th:nth-child(1){
      width:60px;
    }
    td:last-child,th:last-child{
      width:60px;
    }
    td:nth-last-child(2){
      a{
        color: #00eeff;
        cursor: pointer;
      }
    }
  }
  .page{
    text-align: center;
    margin-bottom:50px;
    a{
      margin-right:30px;
      color: #39f1ff;
    }
    span{
      margin-right:30px;
    }
  }
}
</style>
