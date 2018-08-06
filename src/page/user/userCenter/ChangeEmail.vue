<template>
  <section>
    <div class="changeEmail mainMg">
      <form   v-bind:style="{minHeight: this.$store.getters.getMinHeight}" v-on:keyup="emailPassDown">
        <div class="common-nav">
          <router-link to="userCenter">账户安全</router-link> >
          <i>修改邮箱</i>
        </div>
        <div>
          <div class="nomalInput">
            <input   :value="this.$store.state.user.userInfo?this.$store.state.user.userInfo.mobile:''" disabled="true" type="text"/>
          </div>
          <div class="code">
            <input type="text" v-on:focus="showDel('code')" v-on:blur="checkCode()" v-model="form.code" :placeholder="$t('lang.form.pleaseEnterCode')"/>
            <i :class="rules.code.class"  v-on:click="delContent('code')">{{rules.code.message}}</i>
            <span v-on:click="getCode()" ref="send">{{$t('lang.form.getCode')}}</span>
          </div>

          <div class="code">
            <input type="text" v-on:focus="showDel('email')" v-on:blur="checkEmail()" v-model="form.email" :placeholder="$t('lang.form.emailPrompt')"/>
            <i :class="rules.email.class"  v-on:click="delEmail('email')">{{rules.email.message}}</i>
            <span v-on:click="getEmailCode()" ref="sendEmail">{{$t('lang.form.getCode')}}</span>
          </div>

          <div class="codeInput">
            <input v-on:keyup="codeKeyup($event, 0)" v-on:focus="clearVal" :placeholder="$t('lang.form.eCodePrompt1')"  type="text"/>
            <input v-on:keyup="codeKeyup($event, 1)" v-on:focus="clearVal" :placeholder="$t('lang.form.eCodePrompt2')" type="text"/>
            <input v-on:keyup="codeKeyup($event, 2)" v-on:focus="clearVal" :placeholder="$t('lang.form.eCodePrompt3')" type="text"/>
            <input v-on:keyup="codeKeyup($event, 3)" v-on:focus="clearVal" :placeholder="$t('lang.form.eCodePrompt4')" type="text"/>
            <input v-on:keyup="codeKeyup($event, 4)" v-on:focus="clearVal" :placeholder="$t('lang.form.eCodePrompt5')" type="text"/>
            <input v-on:keyup="codeKeyup($event, 5)" v-on:focus="clearVal" :placeholder="$t('lang.form.eCodePrompt6')"  type="text"/>
          </div>

          <div class="to_button click_loading">
            <a :class="button_status===2?'ok_button form_button':'no_button form_button'" v-on:click="changeEmail">
              <span v-if="button_status===0||button_status===2">{{$t("lang.form.submit")}}</span>
              <img v-if="button_status===1" src="../../../../static/img/loading.png" />
            </a>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import FormFun from '../../../utils/FormFun'
import * as api from '../../../service/getData'
import Tool from '../../../utils/Tool'
if (typeof window !== 'undefined') {
  require('../../../../static/greetest/gt')
}
export default {
  name: 'ChangeEmail',
  components: {
  },
  data () {
    return {
      button_status: 0,
      isSendPhoneCode: false,
      captchaObj: null,
      isSendEmailCode: false,
      codeValue: [],
      tokenId: null,
      form: {
        code: '',
        email: ''
      },
      rules: {
        code: {
          message: '',
          class: ''
        },
        email: {
          message: '',
          class: ''
        }
      }
    }
  },
  mounted () {
    this.initDate()
  },
  methods: {
    async initDate () {
      let data = await api.getGreetest()
      let _this = this
      data = data.data
      FormFun.initGreetest(_this, data, function (captchaObj) {
        _this.captchaObj = captchaObj
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
      FormFun.showDel(this, field)
    },
    delContent (field) {
      this.form[field] = ''
    },
    checkCode (bool) {
      return FormFun.checkPhoneCode(this, bool)
    },
    clearVal (event) {
      event.target.value = ''
    },
    getCode () {
      if (this.$refs.send.innerHTML === this.$t('lang.form.getCode')) {
        this.captchaObj.verify()
      }
    },
    checkEmail (bool) {
      return FormFun.checkEmail(this, bool)
    },
    codeKeyup (event, index) {
      FormFun.codeKeyup(this, event, index)
    },
    emailPassDown () {
      if (this.checkCode(true) && this.checkEmail(true) && this.isSendEmailCode && this.isSendPhoneCode && this.codeValue.length === 6) {
        this.button_status = 2
      } else {
        this.button_status = 0
      }
    },
    getEmailCode () {
      let _this = this
      if (!this.checkEmail(true) || _this.isSendEmailCode) {
        return
      }
      if (this.$refs.sendEmail.innerHTML !== this.$t('lang.form.getCode')) {
        return
      }
      let currNode = _this.$refs.sendEmail
      currNode.className = 'button-loading'
      currNode.innerHTML = ''
      _this.isSendEmailCode = true
      api.getEmailCodeByType({email: this.form.email, options: 'set'}).then(function (res) {
        currNode.className = ''
        if (res.status === 200) {
          FormFun.sendCodeed(_this, currNode)
          Tool.setCookie('email_token', res.data.email_token)
        } else {
          currNode.innerHTML = _this.$t('lang.form.getCode')
          _this.isSendEmailCode = false
          _this.$prompt.error(_this.$t('lang.errorPrompt.' + res.message))
        }
      })
    },
    changeEmail () {
      let params = {
        mobile_code: this.form.code,
        email: this.form.email,
        email_code: this.codeValue.join(''),
        tokenId: this.tokenId
      }
      let _this = this
      api.changeEmail(params).then(function (res) {
        if (res.status === 200) {
          _this.$store.dispatch('setUserInfo', res.data.userinfo)
          _this.$mask.showAlert(_this.$t('lang.form.changeSuccess'), 'success', function () {
            _this.$router.push('/userCenter')
          }, _this.$t('lang.form.submit'))
        } else {
          _this.ispass = true
          _this.$prompt.error(_this.$t('lang.errorPrompt.' + res.message))
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../../style/common";
@import "../../../style/form";
.changeEmail{
   background-color: @bg_color;
   form{
     margin:0 300px;
   }
}
</style>
