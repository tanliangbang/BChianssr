<template>
  <div class="prompt">
      <div :class="classStatus">
        {{message}}
      </div>
  </div>
</template>

<script>
export default {
  name: 'Prompt',
  data () {
    return {
      classStatus: 'success',
      message: ''
    }
  },
  methods: {
    showSuccess (message) {
      this.message = message
      this.classStatus = 'success'
    },
    showError (message) {
      this.message = message
      this.classStatus = 'error'
    }
  }
}
</script>

<style lang="less" scoped>
  .prompt{
    >div{
      padding:15px 30px;
      font-size:14px;
      border-radius:5px;
      position:fixed;
      z-index:99999;
      left:50%;
      transform: translateX(-50%);
      animation:showPromptAnimation 2s ease-out;
      animation-fill-mode: forwards;
    }
  }
  .success{
    color:green;
    background:#f0f9eb;
  }
  .error{
    color:red;
    background:#fef0f0;
  }
  @keyframes showPromptAnimation
    {
      0% {
        top:0px;
        opacity:0;
      }
      20% {
        top:80px;
        opacity:1;
      }
      80% {
        top:80px;
        opacity:1;
      }
      100% {
        top:0px;
        opacity:0;
      }
    }
</style>
