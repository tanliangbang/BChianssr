<template>
  <header>
    <div>
      <dl>
        <img src="../../../static/img/logo.png"/>
      </dl>
      <dl>
        <router-link to="/home">{{$t("lang.header.market")}}</router-link>
      </dl>
      <dl>
        <router-link to="/coinToCoin/eth_btc">{{$t("lang.header.exchange")}}</router-link>
      </dl>
      <dl>
        <router-link to="/legalTender">{{$t("lang.header.otc")}}</router-link>
      </dl>
    </div>

    <div :class="isShowLangList?'showLang lang':'closeLang lang'">
        <a v-on:click="toggerLang()">
          {{currStr==='en'?'EN':'中文'}}
        </a>
        <div>
           <a v-on:click="changeLang('cn')">中文</a>
           <a v-on:click="changeLang('en')">English</a>
        </div>
    </div>
     <ul v-if="userInfo !== null">
       <li><router-link to="/entrustManage">{{$t("lang.header.contractManage")}}</router-link></li>
       <li><router-link to="/assetManage">{{$t("lang.header.assetsManage")}}</router-link></li>
       <li><router-link to="/userCenter">{{userInfo.mobile}}</router-link></li>
     </ul>
    <ul v-if="userInfo === null">
      <li> <router-link to="/login">{{$t("lang.header.login")}}</router-link></li>
      <li><router-link to="/regist">{{$t("lang.header.regist")}}</router-link></li>
    </ul>
  </header>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Header',
  data () {
    return {
      isShowLangList: false,
      currStr: 'cn'
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  created () {
    this.$store.dispatch('getUserInfo')
  },
  methods: {
    toggerLang () {
      this.isShowLangList = !this.isShowLangList
    },
    changeLang (str) {
      this.isShowLangList = false
      this.currStr = str
      this.$i18n.locale = str
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
  @import "../../style/common.less";
  header{
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    background: @mainColor;
    color:#fff;
    font-size:16px;
    transition: all 1s ease;
    padding:0px;
    z-index:10;
    min-width:1000px;
    >div:nth-child(1){
      float:left;
      >dl{
        float:left;
        margin-left:20px;
        a{
          padding:0px 30px;
          line-height:57px;
          display:inline-block;
        }
        .router-link-active{
          border-bottom:3px solid #fff;
        }
      }
      >dl:nth-child(1){
        padding-top:6px;
        width: 170px;
        height: 60px;
        background:url("../../../static/img/logobg.png");
        background-size:100% 100%;
        margin-left:0px;
        padding-left:30px;
      }
    }
    >img{
      width:120px;
      height:48px;
      margin-top:6px;
      margin-left:20px;
      margin-right:50px;
      vertical-align: top;
    }
    a{
      color:#fff;
    }
    >span{
      margin:0px;
      padding:0px;
      display:inline-block;
      height:100%;
      width:80px;
      text-align: center;
      cursor: pointer;
      line-height: 60px;
    }
    .selected{
       border-bottom:3px solid #fff;
    }
    ul{
      float:right;
      margin:0px;
      li{
        display:inline-block;
        a{
          display:inline-block;
          padding:0px 20px;
          margin-right:10px;
          text-align: center;
          cursor: pointer;
          line-height: 57px;
        }
        .router-link-active{
          border-bottom:3px solid #fff;
        }
      }
    }
    .lang{
      float:right;
      width:94px;
      height:100%;
      text-align: center;
      margin-right:20px;
      position:relative;
      cursor: pointer;
      >a{
        position:absolute;
        width:100%;
        height:100%;
        background:@mainColor;
        line-height: 60px;
        top:0px;
        left:0px;
        z-index:2;
      }
    }
    .showLang{
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
      >div{
        position:absolute;
        width:220px;
        height:120px;
        background:#294586;
        right:0px;
        top:60px;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
        >a{
          display:block;
          padding-left:34px;
          text-align: left;
          margin-top:20px;
        }
      }
      >a:after{
        content:" ";
        width: 0;
        height: 0;
        position:absolute;
        top:27px;
        left:70px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid #fff;
      }
    }
    .closeLang {
      >div{
        display:none;
      }
    }
    .closeLang{
      >a:after{
        content:" ";
        width: 0;
        height: 0;
        position:absolute;
        top:27px;
        left:70px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid #fff;
      }
    }
}
  .gray{
    color:gray;
    cursor: text;
  }
</style>
