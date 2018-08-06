<template>
  <div class="auther">
    <div class="auther-nav">
      <span v-on:click="changeStep(1)" :class="step===1?'selected':''">{{$t("lang.userCenter.level1")}}</span>
      <span v-on:click="changeStep(2)" :class="step===2?'selected':''">{{$t("lang.userCenter.level2")}}</span>
    </div>
    <div v-if="step===1 && userInfo.levelOneAuthStatus === '-1'" class="nomal-auther" v-on:keyup="check()">
      <div class="inputNomal">
        <span>{{$t("lang.userCenter.name")}}</span>
        <div>
          <input v-model="form.name" v-on:blur="checkName()" v-on:focus="showDel('name')"
                 type="text" :placeholder="$t('lang.userCenter.placeholdName')">
          <span>{{error.name}}</span>
        </div>
      </div>
      <div class="inputNomal">
        <span>{{$t("lang.userCenter.idNumber")}}</span>
        <div>
          <input v-model="form.idCard" v-on:focus="showDel('idCard')"  v-on:blur="checkIdCard()" type="text" :placeholder="$t('lang.userCenter.placeholdIdCard')">
          <span>{{error.idCard}}</span>
        </div>
      </div>

      <div class="upload-div">
        <div>{{$t("lang.userCenter.uploadId1")}}</div>
        <div>
          <div class="upload">
            <div class="preUpload" v-on:click="selectImg($event)">
              <span>上传</span>
              <input type="file" class="hide" v-on:change="uploadImg($event, 'positiveCard')">
            </div>
            <div class="uploading hide">
              <span>上传中......</span>
            </div>
            <div class="updated hide">
               <img v-on:click="changeImg($event)" :src="img.positiveCard">
            </div>
          </div>
        </div>
        <div>
          <img src="../../../../static/img/frontidcard.png">
          <p>{{$t("lang.userCenter.forExample")}}</p>
          <p>{{$t("lang.userCenter.prompt")}}</p>
        </div>
      </div>

      <div class="upload-div">
        <div>{{$t("lang.userCenter.uploadId2")}}</div>
        <div>
          <div class="upload">
            <div class="preUpload" v-on:click="selectImg($event)">
              <span>上传</span>
              <input type="file" class="hide" v-on:change="uploadImg($event, 'backCard')">
            </div>
            <div class="uploading hide">
              <span>上传中......</span>
            </div>
            <div class="updated hide">
              <img v-on:click="changeImg($event)" :src="img.backCard">
            </div>
          </div>
        </div>
        <div>
          <img src="../../../../static/img/backidcard.png">
          <p>{{$t("lang.userCenter.forExample")}}</p>
          <p>{{$t("lang.userCenter.prompt")}}</p>
        </div>
      </div>

      <div class="upload-div">
        <div>{{$t("lang.userCenter.uploadId3")}}</div>
        <div>
          <div class="upload">
            <div class="preUpload" v-on:click="selectImg($event)">
              <span>上传</span>
              <input type="file" class="hide" v-on:change="uploadImg($event, 'headImg')">
            </div>
            <div class="uploading hide">
              <span>上传中......</span>
            </div>
            <div class="updated hide">
              <img v-on:click="changeImg($event)" :src="img.headImg">
            </div>
          </div>
        </div>
        <div>
          <img src="../../../../static/img/holdidcard.png">
          <p>{{$t("lang.userCenter.forExample")}}</p>
          <p>{{$t("lang.userCenter.prompt")}}</p>
        </div>
      </div>
      <div class="to_button click_loading">
        <a :class="button_status===2?'ok_button form_button':'no_button form_button'" v-on:click="submit">
          <span v-if="button_status===0||button_status===2">{{$t("lang.userCenter.next")}}</span>
          <img v-if="button_status===1" src="../../../../static/img/loading.png" />
        </a>
      </div>
    </div>
    <div v-if="step===1 && userInfo.levelOneAuthStatus !== '-1'" class="nomal-auther">
      <div class="inputNomal">
        <span>{{$t("lang.userCenter.name")}}</span>
        <div class="autherIng">
          {{userInfo.realname}}
        </div>
      </div>

      <div class="inputNomal">
        <span>{{$t("lang.userCenter.idNumber")}}</span>
        <div class="autherIng">
          {{userInfo.idCardNo}}
        </div>
      </div>

      <div class="upload-div">
        <div>{{$t("lang.userCenter.uploadId3")}}</div>
        <div class="head-img">
          <img :src="userInfo.idCardFrontPic">
        </div>
      </div>
      <div class="upload-div">
        <div>{{$t("lang.userCenter.uploadId3")}}</div>
        <div class="head-img">
          <img :src="userInfo.idCardBackPic">
        </div>
      </div>
      <div class="upload-div">
        <div>{{$t("lang.userCenter.uploadId3")}}</div>
        <div class="head-img">
          <img :src="userInfo.facePic">
        </div>
      </div>

      <div class="to_button" v-if="userInfo.levelOneAuthStatus === '0'">
        <a class="no_button form_button" >
          {{$t("lang.userCenter.examine")}}
        </a>
      </div>
      <div class="to_button" v-if="userInfo.levelOneAuthStatus === '1'">
        <span class="authered">{{$t("lang.userCenter.authered")}}</span>
      </div>

      <div class="to_button" v-if="userInfo.levelOneAuthStatus === '2'">
        <span class="autherfail">{{userInfo.auditConclusions}}</span>
      </div>
      <div class="to_button" v-if="userInfo.levelOneAuthStatus === '2'">
        <a class="ok_button form_button" v-on:click="showChange()">
          {{$t("lang.userCenter.change")}}
        </a>
      </div>
    </div>

    <div v-if="step===2" class="second-auther">

    </div>
  </div>
</template>

<script>
import Tool from '../../../utils/Tool'
import * as api from '../../../service/getData'
export default {
  name: 'Auther',
  components: {
  },
  props: ['userInfo'],
  data () {
    return {
      step: 1,
      upload_token: null,
      button_status: 0,
      form: {
        name: '',
        idCard: ''
      },
      error: {
        name: '',
        idCard: ''
      },
      img: {
        positiveCard: null,
        backCard: null,
        headImg: null
      }
    }
  },
  async mounted () {
    this.getAuter()
    let data = await api.getUploadParam()
    this.upload_token = data.data.qiniu_upload_token
  },
  methods: {
    changeStep (num) {
      this.step = num
    },
    checkName (bool) {
      let name = Tool.trim(this.form.name)
      if (name === '') {
        if (bool) {
          return false
        }
        this.error.name = this.$t('lang.userCenter.placeholdName')
      } else {
        this.error.name = ''
        return true
      }
    },
    checkIdCard (bool) {
      let idCard = Tool.trim(this.form.idCard)
      if (idCard === '') {
        if (bool) {
          return false
        }
        this.error.idCard = this.$t('lang.userCenter.placeholdIdCard')
      } else if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(idCard))) {
        if (bool) {
          return false
        }
        this.error.idCard = this.$t('lang.userCenter.idCardPrompt')
      } else {
        this.error.idCard = ''
        return true
      }
    },
    showDel(str) {
      this.error[str] = ''
    },
    getAuter() {
      if (this.userInfo.levelOneAuthStatus === '0') {
        let _this = this
        let info = Object.assign({}, _this.userInfo)
        let interval = setInterval(async function() {
          let data = await api.getIsAuthered({ticketId: _this.userInfo.ticketId})
          if (data.data.levelOneAuthStatus !== '0') {
            clearInterval(interval)
            info.levelOneAuthStatus = data.data.levelOneAuthStatus + ''
            info.auditConclusions = data.data.auditConclusions
            _this.$store.dispatch('setUserInfo', info)
          }
        }, 5000)
      }
    },
    check() {
      if (this.checkName(true) && this.checkIdCard(true) && this.img['positiveCard'] !== null && this.img['backCard'] !== null && this.img['headImg'] !== null) {
        this.button_status = 2
      } else {
        this.button_status = 0
      }
    },
    selectImg (event) {
      event.stopPropagation()
      let target = Tool.getTarget(event)
      Tool.stopProp(event)
      let input = null
      if (target.tagName === 'SPAN') {
        input = target.nextElementSibling
      } else if (target.tagName === 'DIV') {
        input = target.firstChild.nextElementSibling
      } else {
        return
      }
      input.click()
    },
    changeImg(event) {
      event.stopPropagation()
      let target = Tool.getTarget(event)
      Tool.stopProp(event)
      target.parentNode.previousElementSibling.previousElementSibling.click()
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
      curr.parentNode.nextElementSibling.nextElementSibling.style.display = 'none'
      api.uploadImg(param, config).then(response => {
        curr.parentNode.nextElementSibling.style.display = 'none'
        curr.parentNode.nextElementSibling.nextElementSibling.style.display = 'block'
        _this.img[name] = 'https://file.niustock.com/' + response.data.key
        _this.check()
      })
    },
    showChange() {
      let info = Object.assign({}, this.userInfo)
      info.levelOneAuthStatus = '-1'
      this.$store.dispatch('setUserInfo', info)
    },
    async submit() {
      let param = {
        identificationNumber: this.form.idCard,
        name: this.form.name,
        idCardFrontPic: this.img.positiveCard,
        idCardBackPic: this.img.backCard,
        facePic: this.img.headImg
      }
      this.button_status = 1
      let data = await api.auther(param)
      if (data.status === 200) {
        let info = data.data
        await this.$store.dispatch('setUserInfo', info)
        this.button_status = 0
        this.$mask.showAlert(this.$t('lang.userCenter.autherSubmited'), 'success')
        this.getAuter()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../style/common";
  @import "../../../style/form";
  .auther-nav{
    width: 100%;
    background-color: #273c6e;
    color:#fff;
    height:56px;
    border-bottom:1px solid #4177fc;
    margin-bottom:20px;
    >span{
      display:inline-block;
      padding:0px 40px;
      margin-right:30px;
      position:relative;
      line-height: 56px;
      cursor: pointer;
    }
    .selected::after{
      content:' ';
      position:absolute;
      height: 5px;
      width:100%;
      left:0px;
      bottom:-2px;
      z-index:2;
      background-image: linear-gradient(176deg, #245bfc 0%, #00a7ff 100%);
    }
  }
  .nomal-auther{
    .inputNomal{
      width: 100%;
      height: 56px;
      border-bottom:1px solid #314b79;
      display: flex;
      flex-wrap: wrap-reverse;
      margin-top:14px;
      >span{
        flex:1;
        padding-left:30px;
        line-height:56px;
        color: #a9c2fd;
      }
      .autherIng{
        line-height:50px;
      }
      >div{
        flex:1;
        >input{
          background-color: #273c6e;
          border-radius: 8px;
          border: solid 2px #304a87;
          color: #fff;
          height:40px;
          font-size: 14px;
          padding-left:20px;
        }
        >span {
          color:#4177fc;
          margin-left:15px;
        }
      }
    }
    .next{
      text-align: center;
      margin-top:172px;
      margin-bottom:30px;
    }
    .button{
      width: 345px;
      height: 56px;
      margin:172px auto 56px;
      display:block;
      text-align: center;
      cursor: pointer;
      border-radius: 8px;
      color:#fff;
      font-size: 17px;
      line-height:56px;
    }
    .no_button {
      background-color: #304a88;
    }
    .ok_button {
      background-color: #4177fc;
    }
  }
  .upload-div{
    color:#fff;
    border-bottom:1px solid #314b79;
    >div{
      height:262px;
      float:left;
      text-align: center;
    }
    >div:nth-child(1) {
      width:30%;
      line-height:262px;
      color: #a9c2fd;
      text-align: left;
      padding-left:30px;
    }
    .upload{
       cursor: pointer;
        width: 320px;
        height: 195px;
        background-color: #28427b;
        border-radius: 4px;
        margin-top:29px;
        position:relative;
        text-align: center;
        .preUpload{
          width:100%;
          height:100%;
          >span{
            font-size:16px;
            color:#fff;
            position:relative;
            margin-top:97px;
            display:inline-block;
          }
          >span:after{
            content: ' ';
            width:23px;
            height:26px;
            position:absolute;
            left:3px;
            top:-30px;
            background:url('../../../../static/img/upload.png')
          }
        }
        .uploading{
          width:100%;
          height:100%;
          >span{
            font-size:16px;
            color:#fff;
            position:relative;
            margin-top:97px;
            display:inline-block;
          }
          >span:after{
            content: ' ';
            width:30px;
            height:32px;
            position:absolute;
            left:20px;
            top:-35px;
            animation: spin 1s linear infinite;
            background:url('../../../../static/img/loading.png')
          }
        }
        .updated{
          width:100%;
          height:100%;
          img {
            width:100%;
            height:100%;
          }
        }
    }
    >div:nth-child(2){
      width:40%;
    }
    >div:nth-child(3){
      width:30%;
      >img{
        margin-top:49px;
        height:109px;
      }
      >p:nth-child(2) {
        font-size: 14px;
        text-align: center;
      }
      >p:nth-child(3) {
        font-size: 12px;
        margin-top:5px;
        text-align: center;
      }
    }
  }
  .head-img{
    img{
      width: 320px;
      height: 196px;
      margin-top:33px;
    }
  }
  .upload-div::after{
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0
  }
  .upload-div:last-child{
    border-bottom:none;
  }
  .authered:before{
    content:'';
    display:inline-block;
    width:16px;
    height:16px;
    vertical-align: -4px;
    margin-right:5px;
    background:url("../../../../static/img/icon_good.png")
  }
  .autherfail:before{
    content:'';
    display:inline-block;
    width:20px;
    height:20px;
    vertical-align: -4px;
    margin-right:5px;
    background:url("../../../../static/img/pfail.png")
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
