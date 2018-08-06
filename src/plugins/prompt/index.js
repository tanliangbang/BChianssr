import Prompt from './Prompt.vue'
export default {
  /**
   * 每个插件都有的install方法，用于安装插件
   * @param {Object} Vue - Vue类
   * @param {Object} [pluginOptions] - 插件安装配置
   */
  install (Vue, pluginOptions = {}) {
    // 创建"子类"方便挂载
    const VuePrompt = Vue.extend(Prompt)
    let temp = null
    let $prompt = {}
    /**
     * 初始化并显示loading
     * @returns {Promise} Promise实例
     */
    function showPrompt () {
      // 判断是否创建
      if (!temp) {
        temp = new VuePrompt()
        // 手动创建一个未挂载的实例
        temp.$mount()
        // 挂载
        document.querySelector(pluginOptions.container || 'body').appendChild(temp.$el)
        setTimeout(function () {
          document.querySelector(pluginOptions.container || 'body').removeChild(temp.$el)
          temp = null
        }, 2000)
      }
    }
    $prompt.success = function (message) {
      showPrompt()
      temp.showSuccess(message)
    }
    $prompt.error = function (message) {
      showPrompt()
      temp.showError(message)
    }
    Vue.$prompt = Vue.prototype.$prompt = $prompt
  }
}
