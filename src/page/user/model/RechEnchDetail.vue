<template>
  <div v-if="isShow" class="rechEnchDetail">
    <div class="mask"></div>
    <div class="maskContent">
       <div class="header">
           详情
          <img v-on:click="closeEnReDetail" class="close-btn" src="../../../../static/img/close.png"/>
       </div>
       <div class="rech-detail">
         <p>提币地址:0x958E03754545ccsddD545ASDF4545fsd</p>
         <p>手续费:564</p>
         <p>区块链交易ID:0xsdfe4654564654sdfsdfas4d5f6s4dfsdfs654sdfsewfhdfgdfg</p>
         <p>钱包处理时间:2018-05-17 15:57:44</p>
       </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RechEnchDetail',
  components: {
  },
  data () {
    return {
      isShow: false
    }
  },
  created () {
  },
  methods: {
    closeEnReDetail () {
      this.isShow = false
    },
    showEnReDetail () {
      this.isShow = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../style/var";
  .mask{
    position:fixed;
    width:100%;
    height:100%;
    z-index:2;
    top:0;
    left:0;
    background:@bg_color;
    opacity:0.8;
  }
  .maskContent{
    width: 642px;
    height: 292px;
    top:50%;
    left:50%;
    margin-left:-321px;
    margin-top:-146px;
    position:fixed;
    z-index:3;
    background-color: #284585;
    box-shadow: 0px 0px 20px 0px
    rgba(30, 40, 65, 0.25);
    border-radius: 14px;
    .header{
      line-height: 70px;
      padding:0px 30px;
      border-bottom:1px solid @index_bg;
      img{
        float:right;
        margin-top:24px;
        width:24px;
        height:24px;
        cursor: pointer;
      }
    }
    .rech-detail{
      padding:28px;
      p{
        font-size: 14px;
        margin-bottom:5px;
        letter-spacing: 2px;
      }
    }
  }
</style>
