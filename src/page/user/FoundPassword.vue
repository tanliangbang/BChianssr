<template>
  <section class="foundPassword mainMg">
      <div v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
        <div class="nav_found">
          <a v-on:click="toChange('phone')" :class="foundWay === 'phone'?'select':''">手机找回密码</a>
          <a v-on:click="toChange('email')" :class="foundWay === 'email'?'select':''">邮箱找回密码</a></div>

        <form class="phone_found"  v-on:keyup="onPageDown">
            <div v-if="foundWay === 'phone'" >
              <div class="nomalInput">
                <input :placeholder="$t('lang.form.phonePrompt')"  v-model="form.phone" v-on:focus="showDel('phone')" v-on:blur="checkPhone()" type="text"/>
                <i :class="rules.phone.class" v-on:click="delContent('phone')" >{{rules.phone.message}}</i>
              </div>
              <div class="code">
                <input type="text" v-on:focus="showDel('code')" v-on:blur="checkCode()" v-model="form.code" :placeholder="$t('lang.form.pleaseEnterCode')"/>
                <i :class="rules.code.class"  v-on:click="delContent('code')">{{rules.code.message}}</i>
                <span v-on:click="getCode()" ref="send">{{$t('lang.form.getCode')}}</span>
              </div>
            </div>

          <div v-if="foundWay === 'email'" >
            <div class="nomalInput">
              <input :placeholder="$t('lang.form.emailPrompt')"  v-model="form.email" v-on:focus="showDel('email')" v-on:blur="checkEmail()" type="text"/>
              <i :class="rules.email.class" v-on:click="delContent('email')" >{{rules.email.message}}</i>
            </div>
            <div class="code">
              <input type="text" v-on:focus="showDel('emailCode')" v-on:blur="checkEmailCode()" v-model="form.emailCode" :placeholder="$t('lang.form.pleaseEnterCode')"/>
              <i :class="rules.emailCode.class"  v-on:click="delContent('emailCode')">{{rules.emailCode.message}}</i>
              <span v-on:click="getEmailCode()" ref="sendEmail">{{$t('lang.form.getCode')}}</span>
            </div>
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
                <span v-if="button_status===0||button_status===2">{{$t("lang.form.loginSubmit")}}</span>
                <img v-if="button_status===1" src="../../../static/img/loading.png" />
              </a>
            </div>
          </form>
      </div>
  </section>
</template>

<script>
import Tool from '../../utils/Tool'
import FormFun from '../../utils/FormFun'
import * as api from '../../service/getData'
if (typeof window !== 'undefined') {
  require('../../../static/greetest/gt')
}
export default {
  name: 'FoundPassword',
  components: {
  },
  data () {
    return {
      isShowpass: false,
      button_status: 0,
      step: 1,
      isSendPhoneCode: false,
      isSendEmailCode: false,
      captchaObj: null,
      tokenId: null,
      phone: null,
      foundWay: 'phone',
      form: {
        phone: '',
        code: '',
        email: '',
        emailCode: '',
        password: '',
        repassword: '',
        recommed: ''
      },
      rules: {
        phone: {
          message: '',
          class: ''
        },
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
        },
        email: {
          message: '',
          class: ''
        },
        emailCode: {
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
  methods: {
    async initDate () {
      let data = await api.getGreetest()
      let _this = this
      data = data.data
      FormFun.initGreetest(_this, data, function (captchaObj) {
        _this.captchaObj = captchaObj
        captchaObj.onSuccess(function () {
          let result = captchaObj.getValidate()
          result.mobile = _this.form.phone
          _this.phone = _this.form.phone
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
    toChange (str) {
      this.foundWay = str
    },
    delContent (field) {
      this.form[field] = ''
    },
    checkPhone (bool) {
      return FormFun.checkPhone(this, bool)
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
    checkEmailCode (bool) {
      return FormFun.checkEmailCode(this, bool)
    },
    onPageDown () {
      if (this.foundWay === 'phone') {
        if (this.isSendPhoneCode && this.checkPhone(true) && this.checkCode(true) && this.checkPass(true) && this.checkRePass(true)) {
          this.button_status = 2
        } else {
          this.button_status = 0
        }
      } else {
        if (this.isSendEmailCode && this.checkEmail(true) && this.checkEmailCode(true) && this.checkPass(true) && this.checkRePass(true)) {
          this.button_status = 2
        } else {
          this.button_status = 0
        }
      }
    },
    submit() {
      let params = {}
      let _this = this
      this.button_status = 1
      if (this.foundWay === 'phone') {
        params = {
          mobile: this.phone,
          tokenId: this.tokenId,
          code: this.form.code,
          pass: Tool.md5(this.form.password)
        }
        api.foundByPone(params).then(function (res) {
          if (res.status === 200) {
            _this.$mask.showAlert(_this.$t('lang.form.foundSuccess'), 'success', function () {
              _this.$router.push('/login')
            }, _this.$t('lang.form.goLogin'))
            _this.button_status = 0
          } else {
            _this.ispass = true
            _this.$prompt.error(_this.$t('lang.errorPrompt.' + res.message))
            _this.button_status = 2
          }
        })
      } else {
        params = {
          email: this.form.email,
          code: this.form.emailCode,
          pass: Tool.md5(this.form.password)
        }
        api.foundByEmail(params).then(function (res) {
          if (res.status === 200) {
            _this.$mask.showAlert(_this.$t('lang.form.foundSuccess'), 'success', function () {
              _this.$router.push('/login')
            }, _this.$t('lang.form.goLogin'))
            _this.button_status = 0
          } else {
            _this.button_status = 2
            _this.$prompt.error(_this.$t('lang.errorPrompt.' + res.message))
          }
        })
      }
    },
    getCode () {
      if (this.checkPhone() && this.$refs.send.innerHTML === this.$t('lang.form.getCode')) {
        this.captchaObj.verify()
      }
    },
    clearVal (event) {
      event.target.value = ''
    },
    checkEmail (bool) {
      return FormFun.checkEmail(this, bool)
    },
    getEmailCode () {
      let _this = this
      if (!FormFun.checkEmail(this, true)) {
        return
      }
      if (this.$refs.sendEmail.innerHTML !== this.$t('lang.form.getCode')) {
        return
      }
      let currNode = _this.$refs.sendEmail
      currNode.className = 'button-loading'
      currNode.innerHTML = ''
      api.resetEmailSendSMS({email: this.form.email}).then(function (res) {
        currNode.className = ''
        if (res.status === 200) {
          FormFun.sendCodeed(_this, currNode)
          _this.isSendEmailCode = true
          Tool.setCookie('email_reset_token', res.data.email_reset_token)
        } else {
          currNode.innerHTML = _this.$t('lang.form.getCode')
          _this.errorMessage = _this.$t('lang.errorPrompt.' + res.message)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../style/common';
  @import './index';
  @import '../../style/form';
  .email_form{
    .toEmail{
      text-align: center;
      margin-top:10px;
    }
    p{
      text-align: center;
      color:#fff;
      font-size:14px;
      margin-top:36px;
    }
  }
  .nav_found{
    padding-top:105px;
    text-align: center;
    margin-bottom:38px;
    a{
      display:inline-block;
      width: 120px;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      line-height:32px;
      color: #ffffff;
      margin-right:68px;
      position:relative;
      cursor: pointer;
    }
    .select:after{
      content:' ';
      position:absolute;
      width:100%;
      height:2px;
      bottom:0px;
      left:0px;
      background-image: linear-gradient(90deg,
      #245bfc 0%,
      #00a7ff 100%);
    }
  }
  .phone_found{
    .rbutton {
      text-align: center;
      margin-bottom:38px;
    }
  }
  .password{
    i:nth-child(2){
      right:40px;
    }
    i:nth-child(3){
      top:22px;
    }
  }
  .errorPrompt{
    margin-top:38px;
    margin-bottom:5px;
    text-align: center;
    color:#00a7ff;
    height:16px;
  }
</style>
