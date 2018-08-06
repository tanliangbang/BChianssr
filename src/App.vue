<template>
  <div id="app">
   <Header></Header>
    <div class="pageContent">
       <router-view/>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/common/Header'
import Footer from './components/common/Footer'
export default {
  name: 'App',
  data () {
    return {
    }
  },
  components: {
    Header,
    Footer
  },
  computed: {
  },
  mounted () {
    let currheight = 0
    this.$store.dispatch('getUserInfo')
    currheight = document.documentElement.clientHeight - 336
    currheight = currheight > 500 ? (currheight + 'px') : '500px'
    this.$store.dispatch('setMinHeight', currheight)
    window.onresize = () => {
      currheight = document.documentElement.clientHeight - 336
      currheight = currheight > 500 ? (currheight + 'px') : '500px'
      this.$store.dispatch('setMinHeight', currheight)
    }
  },
  methods: {
  }
}
</script>

<style lang="less">
 @import "./style/common";
 html,body{
   margin:0px;
   width:100%;
   min-width:1000px;
   min-height:100%;
   position:relative;
/*
   background:linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
*/
   background:@index_bg;
 }
 .pageContent{
   padding-top:60px;
 }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  width:100%;
}
</style>
