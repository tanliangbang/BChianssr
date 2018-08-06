<template>
  <div v-if="userInfo!==null" class="addPayWay" v-bind:style="{minHeight: this.$store.getters.getMinHeight}">
     <div>
        <div class="nav"><router-link to="userCenter?type=payWay">{{$t("lang.userCenter.paymentMethod")}}</router-link> >
          <span>{{$t("lang.userCenter.addCollection")}}</span></div>
        <form v-on:keyup="check()">
           <p>{{$t("lang.userCenter.addPayWay")}}</p>
           <div class="payInput">
             <span>{{$t("lang.userCenter.realName")}}:</span><span>{{userInfo.realname}}</span>
           </div>
           <div class="payInput">
             <span>{{$t("lang.userCenter.idNumber")}}:</span><span>{{userInfo.idCardNo}}</span>
           </div>
          <div class="payInput">
            <span>{{$t("lang.userCenter.paymentMethod")}}:</span>
            <select v-model="payWay" v-on:change="changePayWay">
              <option v-if="!isContains(this.finish, 'bankCard')" value="bankCard">{{$t("lang.userCenter.pay3")}}</option>
              <option v-if="!isContains(this.finish, 'alipay')" value="alipay">{{$t("lang.userCenter.pay2")}}</option>
              <option v-if="!isContains(this.finish, 'wechat')" value="wechat">{{$t("lang.userCenter.pay1")}}</option>
            </select>
          </div>

         <div v-if="payWay==='bankCard'">
           <div class="payInput">
             <span>{{$t("lang.userCenter.bankName")}}:</span>
             <input v-on:focus="showDel('bankDeposit')" v-on:blur="checkEmpty(false, 'bankDeposit')" v-model="form.bankDeposit"  :placeholder="$t('lang.userCenter.bankName')" />
             <i :class="rules.bankDeposit.class" v-on:click="delContent('bankDeposit')" >{{rules.bankDeposit.message}}</i>
           </div>
           <div class="payInput">
             <span>{{$t("lang.userCenter.bankBranch")}}:</span>
             <input  v-on:focus="showDel('bankBranch')" v-on:blur="checkEmpty(false, 'bankBranch')" v-model="form.bankBranch"  :placeholder="$t('lang.userCenter.bankBranch')" />
             <i :class="rules.bankBranch.class" v-on:click="delContent('bankBranch')" >{{rules.bankBranch.message}}</i>
           </div>
           <div class="payInput">
             <span>{{$t("lang.userCenter.bankAccount")}}:</span>
             <input v-on:focus="showDel('bankAccount')" v-on:blur="checkEmpty(false, 'bankAccount')" v-model="form.bankAccount"  :placeholder="$t('lang.userCenter.bankAccount')" />
             <i :class="rules.bankAccount.class" v-on:click="delContent('bankAccount')" >{{rules.bankAccount.message}}</i>
           </div>
         </div>

          <div v-if="payWay==='alipay'">
            <div class="payInput">
              <span>{{$t("lang.userCenter.pay2")}}:</span>
              <input v-on:focus="showDel('alipayAccount')" v-on:blur="checkEmpty(false, 'alipayAccount')" v-model="form.alipayAccount"   :placeholder="$t('lang.userCenter.pay2')" />
              <i :class="rules.alipayAccount.class" v-on:click="delContent('alipayAccount')" >{{rules.alipayAccount.message}}</i>
            </div>
            <div class="payInput">
              <span>{{$t("lang.userCenter.payCode")}}:</span>
              <div class="upload">
                <div>
                  <div class="addImg" v-on:click="selectImg($event)">
                    <img src="../../../../static/img/add.png">
                    <p>{{$t("lang.userCenter.addPrompt1")}}{{$t("lang.userCenter.pay2")}}{{$t("lang.userCenter.addPrompt2")}}</p>
                    <input type="file" class="hide" v-on:change="uploadImg($event, 'alipayQRcode')">
                  </div>
                  <div class="uploading hide">
                    <span>上传中......</span>
                  </div>
                  <div class="hide">
                    <img class="updated-img" :src="form.alipayQRcode">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="payWay==='wechat'">
            <div class="payInput">
              <span>{{$t("lang.userCenter.pay1")}}:</span>
              <input v-on:focus="showDel('wechatAccount')" v-model="form.wechatAccount" v-on:blur="checkEmpty(false, 'wechatAccount')"  :placeholder="$t('lang.userCenter.pay1')" />
              <i :class="rules.wechatAccount.class" v-on:click="delContent('wechatAccount')" >{{rules.wechatAccount.message}}</i>
            </div>
            <div class="payInput">
              <span>{{$t("lang.userCenter.payCode")}}:</span>
              <div class="upload">
                <div>
                  <div class="addImg" v-on:click="selectImg($event)">
                    <img src="../../../../static/img/add.png">
                    <p>{{$t("lang.userCenter.addPrompt1")}}{{$t("lang.userCenter.pay1")}}{{$t("lang.userCenter.addPrompt2")}}</p>
                    <input type="file" class="hide" v-on:change="uploadImg($event, 'wechatQRcode')">
                  </div>
                  <div class="uploading hide">
                    <span>上传中......</span>
                  </div>
                  <div class="hide">
                    <img class="updated-img" :src="form.wechatQRcode">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="to_button click_loading">
            <a :class="button_status===2?'ok_button form_button':'no_button form_button'" v-on:click="submit">
              <span v-if="button_status===0||button_status===2">{{$t("lang.form.submit")}}</span>
              <img v-if="button_status===1" src="../../../../static/img/loading.png" />
            </a>
          </div>
        </form>
     </div>
  </div>
</template>

<script>
import Tool from './../../../utils/Tool'
import * as api from '../../../service/getData'
import { mapGetters } from 'vuex'

export default {
  name: 'AddPayWay',
  components: {
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  data () {
    return {
      payWay: '',
      upload_token: null,
      button_status: 0,
      finish: [],
      form: {
        alipayAccount: '',
        wechatAccount: '',
        bankAccount: '',
        bankDeposit: '',
        bankBranch: '',
        alipayQRcode: '',
        wechatQRcode: ''
      },
      rules: {
        alipayAccount: {
          message: '',
          class: ''
        },
        wechatAccount: {
          message: '',
          class: ''
        },
        bankAccount: {
          message: '',
          class: ''
        },
        bankDeposit: {
          message: '',
          class: ''
        },
        bankBranch: {
          message: '',
          class: ''
        }
      }
    }
  },
  async mounted () {
    let finish = this.$route.query.finish
    this.finish = finish.split(',')
    if (!this.isContains(this.finish, 'bankCard')) {
      this.payWay = 'bankCard'
    } else if (!this.isContains(this.finish, 'alipay')) {
      this.payWay = 'alipay'
    } else {
      this.payWay = 'wechat'
    }
    let data = await api.getUploadParam()
    this.upload_token = data.data.qiniu_upload_token
  },
  methods: {
    delContent (field) {
      this.form[field] = ''
    },
    showDel (field) {
      this.rules[field].class = 'del'
      this.rules[field].message = ''
    },
    changePayWay () {
      this.form = {
        alipayAccount: '',
        wechatAccount: '',
        bankAccount: '',
        bankDeposit: '',
        bankBranch: '',
        alipayQRcode: '',
        wechatQRcode: ''
      }
      this.button_status = 0
    },
    selectImg (event) {
      event.stopPropagation()
      let target = Tool.getTarget(event)
      Tool.stopProp(event)
      let input = null
      if (target.tagName === 'IMG') {
        input = target.nextElementSibling.nextElementSibling
      } else if (target.tagName === 'P') {
        input = target.nextElementSibling
      } else if (target.tagName === 'DIV') {
        input = target.lastChild
      } else {
        return
      }
      input.click()
    },
    checkEmpty (bool, prop) {
      let name = Tool.trim(this.form[prop])
      if (name === '') {
        if (bool) {
          return false
        }
        this.rules[prop].class = 'del'
        this.rules[prop].message = this.$t('lang.userCenter.please') + this.$t('lang.userCenter.' + prop)
      } else {
        this.rules[prop].class = 'pass'
        this.rules[prop].message = ''
        return true
      }
    },
    check () {
      if (this.payWay === 'alipay') {
        if (this.checkEmpty(true, 'alipayAccount')) {
          this.button_status = 2
        } else {
          this.button_status = 0
        }
      } else if (this.payWay === 'wechat') {
        if (this.checkEmpty(true, 'wechatAccount')) {
          this.button_status = 2
        } else {
          this.button_status = 0
        }
      } else {
        if (this.checkEmpty(true, 'bankAccount') && this.checkEmpty(true, 'bankDeposit') && this.checkEmpty(true, 'bankBranch')) {
          this.button_status = 2
        } else {
          this.button_status = 0
        }
      }
    },
    uploadImg(e, name) {
      let curr = Tool.getTarget(e)
      let file = curr.files[0]
      let param = new window.FormData() // 创建form对象
      let _this = this
      param.append('file', file, file.name) // 通过append向form对象添加数据
      param.append('token', this.upload_token)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      curr.parentNode.style.display = 'none'
      curr.parentNode.nextElementSibling.style.display = 'block'
      api.uploadImg(param, config).then(response => {
        curr.parentNode.nextElementSibling.style.display = 'none'
        curr.parentNode.nextElementSibling.nextElementSibling.style.display = 'block'
        _this.form[name] = 'https://file.niustock.com/' + response.data.key
      })
    },
    isContains (arr, item) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
          return true
        }
      }
      return false
    },
    async submit() {
      let param = {
        receiptsWay: this.payWay
      }
      let receiptsInfo = {}
      if (this.payWay === 'alipay') {
        receiptsInfo = {
          account: this.form.alipayAccount,
          QRcode: this.form.alipayQRcode
        }
      } else if (this.payWay === 'wechat') {
        receiptsInfo = {
          account: this.form.wechatAccount,
          QRcode: this.form.wechatQRcode
        }
      } else {
        receiptsInfo = {
          bankAccount: this.form.bankAccount,
          bankDeposit: this.form.bankDeposit,
          bankBranch: this.form.bankBranch
        }
      }
      this.button_status = 1
      param.receiptsInfo = JSON.stringify(receiptsInfo)
      let data = await api.getAddReceipts(param)
      let _this = this
      if (data.status === 200) {
        this.$mask.showAlert(this.$t('lang.userCenter.addSuccess'), 'success', function () {
          _this.$router.push('/userCenter?type=payWay')
        }, this.$t('lang.form.submit'))
        this.button_status = 0
      } else {
        this.$prompt.error(this.$t('lang.errorPrompt.' + data.message))
        this.button_status = 2
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../style/var";
  @import "../../../style/common";
  @import "../../../style/form";
  .addPayWay{
    margin:20px;
    background:@bg_color;
    >div{
      margin:0px 340px;
      .nav{
        font-size:18px;
        padding-top:42px;
        a{
          color: #0088ff;
        }
      }
      >form{
        width:557px;
        margin:50px auto;
        padding-top:44px;
        padding-bottom:84px;
        p:nth-child(1) {
          font-size: 16px;
          text-align: center;
          margin-bottom:30px;
        }
        .payInput{
          position:relative;
          span:nth-child(1){
            width:100px;
            text-align: right;
            line-height: 50px;
            display:inline-block;
            margin-right:28px;
            margin-bottom:14px;
          }
          >span:nth-child(2){
            border-bottom:2px solid #2f4988;
            line-height: 50px;
            width:420px;
            display:inline-block;
          }
          >select{
            width:420px;
            height:50px;
            background-color: #273c6e;
            border: solid 2px #304a87;
            color:#fff;
            font-size:16px;
            border-radius:8px;
            padding-left:20px;
          }
          >input{
            width:420px;
            height:50px;
            background-color: #273c6e;
            border: solid 2px #304a87;
            color:#fff;
            font-size:16px;
            border-radius:8px;
            padding-left:20px;
          }
          .del:after{
            content:" ";
            display:inline-block;
            vertical-align: -3px;
            margin-left:5px;
            width:14px;
            height:14px;
            cursor: pointer;
            background:url("../../../../static/img/but_del.png");
            background-size:100% 100%;
          }
          .pass:after{
            content:" ";
            display:inline-block;
            vertical-align: -3px;
            margin-left:5px;
            width:14px;
            height:14px;
            cursor: pointer;
            background:url("../../../../static/img/icon_good.png");
            background-size:100% 100%;
          }
          >i{
            position:absolute;
            right:12px;
            top:20px;
            color:#38f1ff;
            font-size:12px;
          }
          .upload{
            display:inline-block;
            width:420px;
            height:150px;
            border: solid 2px #4177fc;
            color: #a9c2fd;
            cursor: pointer;
            border-radius: 8px;
            vertical-align: top;
            text-align: center;
            .addImg{
              font-size:12px;
              img{
                margin-top:40px;
              }
              p{
                margin-top:10px;
              }
            }
            .updated-img{
               margin-top: 5px;
               height: 135px;
            }
          }
        }
        .uploading{
          >span{
            font-size:16px;
            color:#fff;
            position:relative;
            display:inline-block;
            margin-top:70px;
          }
          >span:after{
            content: ' ';
            width:30px;
            height:32px;
            position:absolute;
            left:35px;
            top:-35px;
            animation: spin 1s linear infinite;
            background:url('../../../../static/img/loading.png')
          }
        }
        .sub{
          margin:63px auto 0px;
        }
      }
    }
  }
  @keyframes spin {
    0%   {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
