<template>
  <div class="auther" v-if="userInfo">
    <div class="nomal">
      <span>{{$t("lang.userCenter.email")}}:<i>{{userInfo['email']?userInfo['email']:'未绑定'}}</i></span>
      <span  v-if="userInfo['email']"><router-link to="changeEmail">{{$t("lang.userCenter.setUp")}}</router-link></span>
      <span  v-if="!userInfo['email']"><router-link to="bindEmail?from=userCenter">{{$t("lang.userCenter.goBindEmail")}}</router-link></span>
    </div>
    <div class="nomal">
      <span>{{$t("lang.userCenter.phoneNumber")}}:<i>{{userInfo['mobile']}}</i></span>
      <span><i class="grayColor">{{$t("lang.userCenter.unChange")}}</i></span>
    </div>
    <div class="nomal">
      <span>{{$t("lang.userCenter.password")}}:<i>********</i></span>
      <span><router-link to="changePass">{{$t("lang.userCenter.change")}}</router-link></span>
    </div>

    <div class="nomal">
      <span>{{$t("lang.userCenter.loginexist")}}</span>
      <span v-on:click="loginOut">{{$t("lang.userCenter.logout")}}</span>
    </div>

    <div class="login-history" v-if="historyList">
      <div class="title">{{$t("lang.userCenter.loginHistory")}}</div>
      <table>
        <tr><td width="20%">{{$t("lang.userCenter.time")}}</td><td width="20%">{{$t("lang.userCenter.city")}}</td><td width="20%">{{$t("lang.userCenter.loginWay")}}</td>
          <td width="20%">{{$t("lang.userCenter.ip")}}</td><td width="20%">{{$t("lang.userCenter.state")}}</td></tr>
        <tr v-for="(item, index) in historyList.data" :key="index"><td>{{item.loginTime}}</td><td>{{item.city}}</td><td>{{item.loginMode}}</td><td>IP:{{item.ip}}</td><td>{{item.loginStatus}}</td></tr>
      </table>
      <div class="page">
        <a v-if="currpage>1 && !loading" v-on:click="prePage()">{{$t("lang.common.prePage")}}</a>
        <span v-if="currpage<=1 || loading">{{$t("lang.common.prePage")}}</span>
        <span>{{currpage +"/"+ totalpage}}</span>
        <a v-if="currpage<totalpage && !loading" v-on:click="nextPage()">{{$t("lang.common.nextPage")}}</a>
        <span v-if="currpage>=totalpage || loading">{{$t("lang.common.nextPage")}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from './../../../service/getData'
import Tool from './../../../utils/Tool'
import { mapGetters } from 'vuex'
export default {
  name: 'Auther',
  components: {
  },
  props: ['userInfo'],
  data () {
    return {
      currpage: 1,
      totalpage: 0,
      loading: false
    }
  },
  async mounted () {
    await this.$store.dispatch('getLoginHistory', {offset: 0, limit: 5})
    this.totalpage = Math.ceil(parseInt(this.historyList.total) / 5)
  },
  computed: {
    ...mapGetters({
      historyList: 'getLoginHistory'
    })
  },
  methods: {
    loginOut () {
      let _this = this
      this.$mask.showAlert('确定要退出？', 'doubt', async function () {
        let data = await api.loginOut()
        if (data.status === 200) {
          Tool.delCookie('ngtoken')
          _this.$store.dispatch('setUserInfo', null)
          _this.$router.push('/')
        }
      })
    },
    async prePage () {
      if ((this.currpage + 1) <= 1) {
        return
      }
      this.currpage = this.currpage - 1
      let offset = (this.currpage - 1) * 5
      let limit = 5
      this.loading = true
      await this.$store.dispatch('getLoginHistory', {offset: offset, limit: limit})
      this.loading = false
    },
    async nextPage () {
      if ((this.currpage + 1) > this.totalpage) {
        return
      }
      this.currpage = this.currpage + 1
      let offset = (this.currpage - 1) * 5
      let limit = 5
      this.loading = true
      await this.$store.dispatch('getLoginHistory', {offset: offset, limit: limit})
      this.loading = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../style/var";
  .nomal{
    border-bottom: solid 1px #314b79;
    margin-top:15px;
    padding-left:30px;
    a{
      color: #39f1ff;
    }
    >span:nth-child(1) {
      font-size: 17px;
      height: 56px;
      line-height: 56px;
      color: #a9c2fd;
      i{
        margin-left:10px;
      }
    }
    >span:nth-child(2){
      color: #39f1ff;
      font-size:16px;
      margin-right:25px;
      line-height:56px;
      float:right;
      cursor: pointer;
    }
    .grayColor{
      color: #5a78bf;
    }
  }
  .login-history{
    margin-top:100px;
    .title{
      width: 185px;
      height: 50px;
      background-color: #4177fc;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      color:#fff;
      text-align: center;
      font-size: 18px;
      line-height: 50px;
    }
    table {
      margin-top:25px;
      width:100%;
      color:#fff;
      line-height:50px;
      background:#284585;
      td{
        text-align: center;
        border-bottom:1px solid @bg_color;
      }
      tr:last-child{
        td{
          border-bottom:none;
        }
      }
    }
  }
  .page{
    margin:30px 0px;
    text-align: center;
    color:#fff;
    span{
      margin-right:30px;
    }
    >a{
      cursor: pointer;
      margin-right:30px;
      color:@click_color;
    }
  }
</style>
