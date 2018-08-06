import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

var routers = [
  {
    path: '/',
    redirect: {name: 'home'}
  },
  {
    path: '/home',
    name: 'home',
    component: (resolve) => require(['src/page/Index'], resolve)
  },
  {
    path: '/login',
    name: 'login',
    component: (resolve) => require(['src/page/user/Login'], resolve)
  },
  {
    path: '/legalTender',
    name: 'legalTender',
    component: (resolve) => require(['src/page/exchange/LegalTender'], resolve)
  },
  {
    path: '/makeOrder',
    name: 'makeOrder',
    component: (resolve) => require(['src/page/exchange/model/makeOrder'], resolve)
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    component: (resolve) => require(['src/page/exchange/model/OrderDetail'], resolve)
  },
  {
    path: '/coinToCoin/:id',
    name: 'coinToCoin',
    component: (resolve) => require(['src/page/exchange/CoinToCoin'], resolve)
  },
  {
    path: '/userCenter',
    name: 'userCenter',
    component: (resolve) => require(['src/page/user/userCenter/UserCenter'], resolve)
  },
  {
    path: '/addPayWay',
    name: 'addPayWay',
    component: (resolve) => require(['src/page/user/userCenter/AddPayWay'], resolve)
  },
  {
    path: '/regist',
    name: 'regist',
    component: (resolve) => require(['src/page/user/Regist'], resolve)
  },
  {
    path: '/foundPassword',
    name: 'foundPassword',
    component: (resolve) => require(['src/page/user/FoundPassword'], resolve)
  },
  {
    path: '/entrustManage',
    name: 'entrustManage',
    component: (resolve) => require(['src/page/user/EntrustManage'], resolve)
  },
  {
    path: '/assetManage',
    name: 'assetManage',
    component: (resolve) => require(['src/page/user/AssetManage'], resolve)
  },
  {
    path: '/financeRecord',
    name: 'financeRecord',
    component: (resolve) => require(['src/page/user/FinanceRecord'], resolve)
  },
  {
    path: '/bindEmail',
    name: 'bindEmail',
    component: (resolve) => require(['src/page/user/userCenter/BindEmail'], resolve)
  },
  {
    path: '/changeEmail',
    name: 'changeEmail',
    component: (resolve) => require(['src/page/user/userCenter/ChangeEmail'], resolve)
  },
  {
    path: '/changePass',
    name: 'changePass',
    component: (resolve) => require(['src/page/user/userCenter/ChangePass'], resolve)
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: (resolve) => require(['src/page/other/Agreement'], resolve)
  }
]

export default new Router({
  mode: 'history',
  routes: routers
})
