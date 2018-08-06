<template>
  <div class="footer">
     <div>
       <ul>
          <li><router-link to="help">新手帮助</router-link></li>
          <li><router-link to="agreement">服务协议</router-link></li>
          <li><router-link to="contactUs">联系我们</router-link></li>
          <li>support@lian1xia.com</li>
       </ul>
       <div class="footIcon">
         <span v-on:mouseenter="showFn(1)" v-on:mouseleave="hide()"></span>
         <span v-on:mouseenter="showFn(2)" v-on:mouseleave="hide()"></span>
         <img :class="show===1?'':'none'" src="../../../static/img/weixn_ma.png">
         <img :class="show===2?'':'none'" src="../../../static/img/telegram_ma.png">
       </div>
     </div>
     <div>©2018 BILIAN</div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      show: 0
    }
  },
  methods: {
    showFn (num) {
      this.show = num
    },
    hide () {
      this.show = 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
  @import "../../style/common.less";
  .footer{
    width:100%;
    padding:0 25%;
    background:@mainColor;
    >div:nth-child(1)::after{
      clear:both;
      content:'';
      display:block;
      width:0;
      height:0;
      visibility:hidden;
    }
    >div:nth-child(1) {
      padding:50px 0px;
      color:#fff;
      ul{
        float:left;
        li{
          a{
            color:#fff;
          }
          a:hover{
            color:#a9c2fd;
          }
          font-size:17px;
          margin-top:15px;
        }
      }
      .footIcon{
        float:left;
        margin-top:100px;
        margin-left:80px;
        position:relative;
        img:nth-child(3){
          top:-84px;
          left:-26px;
          position:absolute;
        }
        img:nth-child(4){
          top:-84px;
          left:26px;
          position:absolute;
        }
        span:nth-child(1) {
          background:url('../../../static/img/weixin.png');
          margin-right:20px;
          opacity: 0.8;
        }
        span:nth-child(2) {
          background:url('../../../static/img/telegram.png');
          opacity: 0.8;
        }
        span:hover{
          opacity:1;
        }
        span{
          display:inline-block;
          width:26px;
          height:26px;
          cursor: pointer;
        }
      }
    }
    >div:nth-child(2){
      color:#fff;
      padding-bottom:20px;
      text-align: center;
    }
  }
</style>
