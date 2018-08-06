<template>
    <div v-bind:class="isShow?'wrapper' : 'hide'">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      isShow: false
    }
  },
  mounted () {
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
  @import "../../style/common.less";
  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 100%;
    max-width: 500px;
    height: 200px;
  }

  .box {
    width: 10px;
    height: 10px;
    margin: 0 5px;
    border-radius: 50%;
    -webkit-transform: translateY(0) rotate(0deg);
    transform: translateY(0) rotate(0deg);
    -webkit-animation: change 1s infinite alternate;
    animation: change 1s infinite alternate;
  }

  .box:nth-child(1) {
    background-color: #FF0033;
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }

  .box:nth-child(2) {
    background-color: #FFFF00;
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  .box:nth-child(3) {
    background-color:#003399;
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }

  .box:nth-child(4) {
    background-color: #99CC33;
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  .box:nth-child(5) {
    background-color: #99CCFF;
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }

  .box:nth-child(6) {
    background-color: #08D9D6;
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }

  .box:nth-child(7) {
    background-color:#9933FF;
    -webkit-animation-delay: 0.7s;
    animation-delay: 0.7s;
  }

  .box:nth-child(8) {
    background-color: #FF6600;
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }

  .box:nth-child(9) {
    background-color: #FF2E63;
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }

  .box:nth-child(10) {
    background-color: #996600;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }

  @keyframes change {
    0% {
      -webkit-transform: translateY(0px) rotate(0deg);
      transform: translateY(0px) rotate(0deg);
      border-radius: 50%;
    }
    50% {
      -webkit-transform: translateY(150px) rotate(180deg);
      transform: translateY(150px) rotate(180deg);
      border-radius: 50%;
    }
    100% {
      -webkit-transform: translateY(0px) rotate(360deg);
      transform: translateY(0px) rotate(360deg);
      border-radius: 50%;
    }
  }
</style>
