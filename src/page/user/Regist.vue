<template>
  <section class="regist mainMg">
      <div v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
          <form  v-on:keyup="onPageDown" class="step1">
             <p>{{$t("lang.form.registTitle")}}</p>
             <div class="nomalInput">
               <input :placeholder="$t('lang.form.phonePrompt')"   v-model="form.phone" v-on:focus="showDel('phone')" v-on:blur="checkPhone()" type="text"/>
               <i :class="rules.phone.class" v-on:click="delContent('phone')" >{{rules.phone.message}}</i>
               <div class="userExist" v-if="userExist">
                 <i>{{$t('lang.form.userExsit')}}</i><router-link to="login">{{$t('lang.form.goLogin')}}</router-link>
               </div>
             </div>
             <div class="code">
               <input type="text" v-on:focus="showDel('code')"  v-on:blur="checkCode()" v-model="form.code" :placeholder="$t('lang.form.pleaseEnterCode')"/>
               <i :class="rules.code.class"  v-on:click="delContent('code')">{{rules.code.message}}</i>
               <span v-on:click="getCode()"  ref="send">{{$t('lang.form.getCode')}}</span>
             </div>
             <div class="nomalInput password">
               <input :placeholder="$t('lang.form.passPrompt')" v-model="form.password" v-on:blur="checkPass()" :type="isShowpass?'text':'password'"/>
               <i :class="rules.password.class"  v-on:click="delContent('password')">{{rules.password.message}}</i>
               <i v-on:click="showpass()" :class="isShowpass?'showpass':'hidepass'"></i>
             </div>
             <div class="nomalInput password">
               <input :placeholder="$t('lang.form.repassPrompt')"  v-model="form.repassword" v-on:blur="checkRePass()" :type="isShowpass?'text':'password'"/>
               <i :class="rules.repassword.class"  v-on:click="delContent('repassword')">{{rules.repassword.message}}</i>
               <i v-on:click="showpass()" :class="isShowpass?'showpass':'hidepass'"></i>
             </div>
             <div class="nomalInput">
               <input :placeholder="$t('lang.form.referrer')"  type="text"/>
             </div>
            <div class="to_button click_loading">
              <a :class="button_status===2?'ok_button form_button':'no_button form_button'" v-on:click="regist">
                <span v-if="button_status===0||button_status===2">{{$t("lang.form.next")}}</span>
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
  name: 'Regist',
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
      userExist: false,
      form: {
        phone: '',
        code: '',
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
          _this.isSendPhoneCode = true
          let currNode = _this.$refs.send
          currNode.className = 'button-loading'
          currNode.innerHTML = ''
          api.sendSMS(result).then(function (res) {
            currNode.className = ''
            if (res.status === 200) {
              _this.tokenId = res.data.tokenId
              FormFun.sendCodeed(_this, currNode)
            } else if (res.status === 409) {
              currNode.innerHTML = _this.$t('lang.form.getCode')
              _this.userExist = true
            } else {
              currNode.innerHTML = _this.$t('lang.form.getCode')
              _this.$prompt.error(_this.$t('lang.form.sendFail'))
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
    checkPhone (bool) {
      this.userExist = false
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
    onPageDown () {
      if (this.isSendPhoneCode && this.checkPhone(true) && this.checkCode(true) && this.checkPass(true) && this.checkRePass(true)) {
        this.button_status = 2
      } else {
        this.button_status = 0
      }
    },
    regist() {
      let params = {
        mobile: this.phone,
        tokenId: this.tokenId,
        code: this.form.code,
        pass: Tool.md5(this.form.password),
        referee: this.form.recommed
      }
      let _this = this
      this.button_status = 1
      api.regist(params).then(function (res) {
        if (res.status === 200) {
          _this.$store.dispatch('setUserInfo', res.data.userinfo)
          _this.$router.push('/bindEmail')
          _this.button_status = 0
        } else {
          _this.error = true
          _this.errorMessage = _this.$t('lang.errorPrompt.' + res.message)
          _this.ispass = true
          _this.button_status = 2
        }
      })
    },
    getCode () {
      if (this.checkPhone() && this.$refs.send.innerHTML === this.$t('lang.form.getCode')) {
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
@import '../../style/common';
@import './index';
@import './../../style/form.less';
.step1{
    padding-top:50px;
    p:nth-child(1){
      text-align: center;
      font-size: 20px;
      color: #ffffff;
      margin:0 0 38px 0;
  }
  .registFial{
    margin-top:28px;
    margin-bottom:10px;
    font-size:14px;
    color: #39f1ff;
  }
  .rbutton{
    text-align: center;
    margin-bottom:30px;
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
.visiable{
  visibility: hidden;
}
.userExist{
  position:absolute;
  right:30px;
  top: 17px;
  >i{
    font-size:12px;
    margin-right:5px;
  }
  >a{
    color: #39f1ff;
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
