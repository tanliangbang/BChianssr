<template>
  <div >
     <div class="mask" v-if="isShow"></div>
     <div class="maskContent" v-if="isShowContent">
         <img v-on:click="closeAlert" class="closeBtn" src="../../../static/img/close.png">
         <p>
           <i v-if="type==='success'" class="success">{{content}}</i>
           <i v-if="type==='doubt'" class="doubt">{{content}}</i>
           <i v-if="type==='fail'" class="fail">{{content}}</i>
         </p>
         <button v-on:click="next">{{btnContent}}</button>
     </div>
  </div>
</template>

<script>
export default {
  name: 'Prompt',
  data () {
    return {
      isShow: false,
      content: '',
      type: '',
      closeCallback: null,
      isShowContent: false,
      btnContent: '确认'
    }
  },
  methods: {
    showMask () {
      this.isShow = true
    },
    closeMask () {
      this.isShow = false
    },
    showAlert (str, type, callback, btnContent) {
      this.isShowContent = true
      this.content = str
      this.type = type
      this.closeCallback = callback
      if (btnContent) {
        this.btnContent = btnContent
      } else {
        this.btnContent = '确认'
      }
    },
    closeAlert () {
      this.closeMask()
      this.isShowContent = false
    },
    next () {
      this.closeAlert()
      this.closeMask()
      if (this.closeCallback) {
        this.closeCallback()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./../../style/var";
  .mask{
    width:100%;
    height:100%;
    position:absolute;
    background:#273c6c;
    top:0px;
    left:0px;
    opacity:0.8;
    z-index:8;
  }
  .maskContent{
    width:384px;
    height:256px;
    position:fixed;
    z-index:9;
    top:50%;
    left:50%;
    margin-left:-197px;
    margin-top:-128px;
    background:@mainColor;
    border-radius: 14px;
    text-align: center;
  }
  .closeBtn{
    position:absolute;
    right:15px;
    top:15px;
    cursor: pointer;
  }
  p{
    margin-top:74px;
    color:#fff;
    font-size:16px;
    text-align: center;
    .success:before{
      content:'';
      display:inline-block;
      width:20px;
      height:20px;
      vertical-align: -4px;
      margin-right:5px;
      background:url("../../../static/img/pok.png")
    }
    .fail:before{
      content:'';
      display:inline-block;
      width:20px;
      height:20px;
      vertical-align: -4px;
      margin-right:5px;
      background:url("../../../static/img/pfail.png")
    }
    .doubt:before{
      content:'';
      display:inline-block;
      width:20px;
      height:20px;
      vertical-align: -4px;
      margin-right:5px;
      background:url("../../../static/img/doubt.png")
    }
  }
  button{
    width: 230px;
    height: 40px;
    background-image: linear-gradient(176deg, #245bfc 0%, #00a7ff 100%);
    border-radius: 100px;
    border:none;
    color:#fff;
    font-size:16px;
    margin-top:70px;
    cursor: pointer;
  }
  .zIndex {
    z-index:8;
  }
</style>
