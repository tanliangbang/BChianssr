<template>
  <div class="banner">
      <div ref="mainContainer">
        <div v-bind:style="{ background:'url(static/img/banner1.png) no-repeat center center'}"></div>
        <div v-bind:style="{ background:'url(static/img/banner2.png) no-repeat center center'}"></div>
        <div v-bind:style="{ background:'url(static/img/banner3.png) no-repeat center center'}"></div>
        <div v-bind:style="{ background:'url(static/img/banner4.png) no-repeat center center'}"></div>
      </div>
      <ul>
        <li v-on:click="changeImg(0)" :class="index===0?'selected':'unselected'"><img src="static/img/b1.png" /></li>
        <li v-on:click="changeImg(1)" :class="index===1?'selected':'unselected'"><img src="static/img/b2.png" /></li>
        <li v-on:click="changeImg(2)" :class="index===2?'selected':'unselected'"><img src="static/img/b3.png" /></li>
        <li v-on:click="changeImg(3)" :class="index===3?'selected':'unselected'"><img src="static/img/b4.png" /></li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  components: {
  },
  data () {
    return {
      index: 0,
      interval: null
    }
  },
  created () {
  },
  mounted () {
    let curr = 0
    let up = true
    let _this = this
    this.interval = setInterval(function () {
      curr = _this.index
      if (up && curr < 3) {
        _this.index = ++curr
        _this.changeImg(_this.index)
      } else {
        if (curr === 0) {
          _this.index = ++curr
          _this.changeImg(_this.index)
          up = true
          return
        } else {
          up = false
        }
        _this.index = --curr
        _this.changeImg(_this.index)
      }
    }, 5000)
  },
  methods: {
    changeImg (index) {
      this.index = index
      // this.$refs.mainContainer.style.transform = 'translate(0px,' + (-260 * index) + 'px)'
      if (!this.$refs.mainContainer) {
        clearInterval(this.interval)
        return
      }
      this.$refs.mainContainer.style.marginTop = (-260 * index) + 'px'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.banner{
  width:100%;
  height:100%;
  position:relative;
  overflow: hidden;
  >div{
    width:100%;
    height:100%;
    padding-right:140px;
    transition:all 0.5s ease-in-out;
    >div{
      width:100%;
      height:100%;
    }
  }
  ul{
    width:140px;
    position:absolute;
    height:100%;
    right:0px;
    top:0px;
    li{
      margin:0px;
      padding:0px;
      height:65px;
      position:relative;
      cursor: pointer;
    }
    .unselected:after{
      content:'';
      width:100%;
      height:100%;
      background:#2A3141;
      opacity: 0.8;
      position:absolute;
      top:0px;
      left:0px;
    }
    img{
      width:100%;
      height:65px;
    }
  }
}
</style>
