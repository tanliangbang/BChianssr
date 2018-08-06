import Mask from './Mask.vue'
export default {
  /**
   * 每个插件都有的install方法，用于安装插件
   * @param {Object} Vue - Vue类
   * @param {Object} [pluginOptions] - 插件安装配置
   */
  install (Vue, pluginOptions = {}) {
    // 创建"子类"方便挂载
    const VuePrompt = Vue.extend(Mask)
    let temp = null
    let $mask = {}
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
      }
    }
    $mask.showMask = function () {
      showPrompt()
      temp.showMask()
    }
    $mask.closeMask = function () {
      showPrompt()
      temp.closeMask()
    }
    $mask.showAlert = function (message, type, callback, btnContent) {
      showPrompt()
      temp.showMask()
      temp.showAlert(message, type, callback, btnContent)
    }
    $mask.closeAlert = function () {
      showPrompt()
      temp.showMask()
      temp.closeAlert()
    }
    Vue.$mask = Vue.prototype.$mask = $mask
  }
}
