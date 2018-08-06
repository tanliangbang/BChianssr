<template>
  <section class="mainMg">
      <form class="bindEmail" v-on:keyup="emailPassDown" v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
        <p v-if="!from">
          {{$t('lang.form.successPrompt')}}<br/>
          {{$t('lang.form.bindEmailPrompt')}}
        </p>
        <p v-if="from">
          {{$t('lang.form.bindEmailPrompt')}}
        </p>
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
          <a :class="button_status===2?'ok_button form_button':'no_button form_button'" v-on:click="bindEmail">
            <span v-if="button_status===0||button_status===2">{{$t("lang.form.submit")}}</span>
            <img v-if="button_status===1" src="../../../../static/img/loading.png" />
          </a>
        </div>
      </form>
  </section>
</template>

<script>
import Tool from '../../../utils/Tool'
import FormFun from '../../../utils/FormFun'

import * as api from '../../../service/getData'
export default {
  name: 'BindEmail',
  components: {
  },
  data () {
    return {
      isSendEmailCode: false,
      button_status: 0,
      codeValue: [],
      form: {
        email: ''
      },
      from: null,
      rules: {
        email: {
          message: '',
          class: ''
        }
      }
    }
  },
  created () {
    this.from = this.$route.query.from
  },
  methods: {
    delEmail () {
      this.form.email = ''
    },
    showDel (field) {
      this.rules[field].class = 'del'
      this.rules[field].message = ''
    },
    checkEmail (bool) {
      return FormFun.checkEmail(this, bool)
    },
    emailPassDown () {
      if (this.checkEmail(true) && this.isSendEmailCode && this.codeValue.length === 6) {
        this.button_status = 2
      } else {
        this.button_status = 0
      }
    },
    bindEmail () {
      let params = {
        email: this.form.email,
        code: this.codeValue.join('')
      }
      let _this = this
      this.button_status = 1
      api.bindEmail(params).then(function (res) {
        if (res.status === 200) {
          _this.$store.dispatch('setUserInfo', res.data.userinfo)
          _this.$mask.showAlert(_this.$t('lang.form.bindSuccess'), 'success', function () {
            _this.button_status = 0
            if (_this.from) {
              _this.$router.push('/')
            } else {
              _this.$router.push('/userCenter')
            }
          }, _this.$t('lang.form.submit'))
        } else {
          _this.button_status = 2
          _this.$prompt.error(_this.$t('lang.errorPrompt.' + res.message))
        }
      })
    },
    codeKeyup (event, index) {
      FormFun.codeKeyup(this, event, index)
    },
    clearVal (event) {
      event.target.value = ''
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
      _this.isSendEmailCode = true
      currNode.className = 'button-loading'
      currNode.innerHTML = ''
      api.getEmailCodeByType({email: this.form.email, options: 'bind'}).then(function (res) {
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../style/common';
@import './../index';
@import './../../../style/form.less';
.bindEmail {
  background-color: @bg_color;
  padding-top: 100px;
  > p:nth-child(1) {
    text-align: center;
    font-size: 20px;
    color: #fff;
    letter-spacing: 0px;
    margin: 0 0 50px 0;
  }
  > p:nth-child(2) {
    margin-top: 75px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    letter-spacing: 0px;
  }
  .login_button{
    margin-top:18px;
    text-align: center;
  }
}

</style>
