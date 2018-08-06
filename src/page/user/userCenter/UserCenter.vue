<template>
  <div class="userCenter mainMg" v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
      <section>
        <div class="nav">
          <a v-on:click="change('userInfo')" :class="nav==='userInfo'?'selected':'unselect'">{{$t("lang.userCenter.accountSecurity")}}</a>
          <a v-on:click="change('auther')" :class="nav==='auther'?'selected':'unselect'">{{$t("lang.userCenter.verification")}}</a>
          <a v-on:click="change('payWay')" :class="nav==='payWay'?'selected':'unselect'">{{$t("lang.userCenter.paymentMethod")}}</a>
        </div>
        <div v-if="nav==='userInfo'">
           <UserInfo :userInfo = "userInfo"/>
        </div>
        <div v-if="nav==='auther'" >
          <Auther v-if="userInfo!==null" :userInfo = "userInfo" />
        </div>
        <div v-if="nav==='payWay'" >
          <PayWay v-if="userInfo!==null" :userInfo = "userInfo"/>
        </div>
      </section>
  </div>
</template>

<script>
import Auther from './Auther'
import UserInfo from './UserInfo'
import PayWay from './PayWay'
import { mapGetters } from 'vuex'

export default {
  name: 'UserCenter',
  components: {
    Auther,
    UserInfo,
    PayWay
  },
  data () {
    return {
      nav: 'userInfo'
    }
  },
  created () {
    let type = this.$route.query['type']
    if (type) {
      this.nav = type
    }
  },
  computed: {
    ...mapGetters({
      historyList: 'getLoginHistory',
      userInfo: 'getUserInfo'
    })
  },
  mounted () {
  },
  methods: {
    change (str) {
      this.nav = str
      this.$router.push('userCenter?type=' + str)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../../style/common";
.userCenter{
  background:@bg_color;
  section{
    overflow:hidden;
    max-width:1200px;
    margin:0 auto;
  }
}
.nav{
  width: 100%;
  height: 50px;
  margin:90px auto 48px;
  border-bottom:1px solid #4177fc;
  a{
    line-height: 50px;
    text-align: center;
    width:185px;
    cursor: pointer;
    color:#a8c1ff;
    display:block;
    float:left;
    border:1px solid #4177fc;
    border-bottom:none;
  }
  a{
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .selected{
    color:#fff;
    background:#4177fc;
  }
}
</style>
