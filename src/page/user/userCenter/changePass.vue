<template>
  <section>
    <div class="changePass mainMg">
      <form   v-bind:style="{minHeight: this.$store.getters.getMinHeight}" v-on:keyup="onPageDown">
        <div class="common-nav">
          <router-link to="userCenter">账户安全</router-link> >
          <i>找回密码</i>
        </div>
        <div class="nomalInput">
          <input   :value="this.$store.state.user.userInfo?this.$store.state.user.userInfo.mobile:''" disabled="true" type="text"/>
        </div>
        <div class="code">
          <input type="text" v-on:focus="showDel('code')" v-on:blur="checkCode()" v-model="form.code" :placeholder="$t('lang.form.pleaseEnterCode')"/>
          <i :class="rules.code.class"  v-on:click="delContent('code')">{{rules.code.message}}</i>
          <span v-on:click="getCode()" ref="send">{{$t('lang.form.getCode')}}</span>
        </div>
        <div class="nomalInput password">
          <input :placeholder="$t('lang.form.passPrompt')" v-model="form.password" v-on:blur="checkPass()" :type="isShowpass?'text':'password'"/>
          <i :class="rules.password.class"  v-on:click="delContent('password')">{{rules.password.message}}</i>
          <i v-on:click="showpass()" :class="isShowpass?'showpass':'hidepass'"></i>
        </div>
        <div class="nomalInput password">
          <input :placeholder="$t('lang.form.repassPrompt')" v-model="form.repassword" v-on:blur="checkRePass()" :type="isShowpass?'text':'password'"/>
          <i :class="rules.repassword.class"  v-on:click="delContent('repassword')">{{rules.repassword.message}}</i>
          <i v-on:click="showpass()" :class="isShowpass?'showpass':'hidepass'"></i>
        </div>
        <div class="to_button click_loading">
          <a :class="button_status===2?'ok_button form_button':'no_button form_button'" v-on:click="submit">
            <span v-if="button_status===0||button_status===2">{{$t("lang.form.submit")}}</span>
            <img v-if="button_status===1" src="../../../../static/img/loading.png" />
          </a>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import FormFun from '../../../utils/FormFun'
import * as api from '../../../service/getData'
import { mapGetters } from 'vuex'
import Tool from '../../../utils/Tool'
if (typeof window !== 'undefined') {
  require('static/greetest/gt')
}
export default {
  name: 'ChangePass',
  components: {
  },
  data () {
    return {
      isShowpass: false,
      button_status: 0,
      isSendPhoneCode: false,
      captchaObj: null,
      tokenId: null,
      phone: null,
      form: {
        code: '',
        password: '',
        repassword: ''
      },
      rules: {
        code: {
          message: '',
          class: ''
        },
        password: {
          message: '',
          class: ''
        },
        repassword: {
          message: '',
          class: ''
        }
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.initDate()
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    async initDate () {
      let data = await api.getGreetest()
      let _this = this
      data = data.data
      FormFun.initGreetest(_this, data, function (captchaObj) {
        _this.captchaObj = captchaObj
        captchaObj.onSuccess(function () {
          let result = captchaObj.getValidate()
          result.gee_token = data.gee_token
          let currNode = _this.$refs.send
          currNode.className = 'button-loading'
          currNode.innerHTML = ''
          api.resetSendSMS(result).then(function (res) {
            currNode.className = ''
            if (res.status === 200) {
              _this.tokenId = res.data.tokenId
              _this.isSendPhoneCode = true
              FormFun.sendCodeed(_this, currNode)
            } else {
              currNode.innerHTML = _this.$t('lang.form.getCode')
              _this.$prompt.error(_this.$t('lang.errorPrompt.' + res.message))
            }
          })
        })
      })
    },
    showDel (field) {
      this.rules[field].class = 'del'
      this.rules[field].message = ''
    },
    delContent (field) {
      this.form[field] = ''
    },
    checkCode (bool) {
      return FormFun.checkPhoneCode(this, bool)
    },
    checkPass (bool) {
      return FormFun.checkPass(this, bool)
    },
    checkRePass (bool) {
      return FormFun.checkRePass(this, bool)
    },
    showpass () {
      this.isShowpass = !this.isShowpass
    },
    onPageDown () {
      if (this.isSendPhoneCode && this.checkCode(true) && this.checkPass(true) && this.checkRePass(true)) {
        this.button_status = 2
      } else {
        this.button_status = 0
      }
    },
    submit () {
      let params = {
        tokenId: this.tokenId,
        code: this.form.code,
        pass: Tool.md5(this.form.password)
      }
      let _this = this
      this.button_status = 1
      api.foundByPone(params).then(function (res) {
        if (res.status === 200) {
          _this.$mask.showAlert(_this.$t('lang.form.changeSuccess'), 'success', function () {
            _this.$router.push('/userCenter')
          }, _this.$t('lang.form.submit'))
          _this.button_status = 0
        } else {
          _this.button_status = 2
          _this.$prompt.error(_this.$t('lang.errorPrompt.' + res.message))
        }
      })
    },
    getCode () {
      if (this.$refs.send.innerHTML === this.$t('lang.form.getCode')) {
        this.captchaObj.verify()
      }
    },
    clearVal (event) {
      event.target.value = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../style/common';
@import './../../../style/form.less';
.changePass{
   background-color: @bg_color;
   form{
     margin:0 300px;
   }
}
</style>
