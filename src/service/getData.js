import config from 'config/index'
import { createAPI } from 'create-api'

const http = createAPI(config)

/**
 * 获取首页行情列表
 */
const base = '/api/v1'
// const mock = '/v1'
export const getCoinList = () => http.get(base + '/market/ticker', {
})

/**
 * 获取滑动验证的参数
 */
export const getGreetest = () => http.get(base + '/tokens/geeTestInit', {
})

/**
 * 发送验证码
 */
export const sendSMS = (params) => http.post(base + '/tokens/sms', params)

/**
 * 注册
 */
export const regist = (params) => http.post(base + '/tokens/mobiles', params)

/**
 * 登入
 */
export const accounts = (params) => http.post(base + '/tokens/accounts', params)

/**
 * 获取用户信息
 */
export const getUserInfo = (params) => http.get(base + '/users/current', params)

/**
 * 发送邮箱验证码
 */
export const getEmailCode = (params) => http.post(base + '/emails/bind/code', params)
/**
 * 绑定邮箱
 */
export const bindEmail = (params) => http.post(base + '/emails/bind/verify', params)

/**
 * 退出登入
 */
export const loginOut = (params) => http.post(base + '/tokens/current', params, 'delete')

/**
 * 找回密码发送短信验证码
 */
export const resetSendSMS = (params) => http.post(base + '/tokens/sms/retrieve', params)

/**
 * 修改密码发送短信验证码
 */
export const changePassOrEmailSendSMS = (params) => http.post(base + '/tokens/sms/reset', params)

/**
 * 找回密码发送邮箱验证码
 */
export const resetEmailSendSMS = (params) => http.post(base + '/emails/reset/code', params)

/**
 * 通过手机号码找回密码
 */
export const foundByPone = (params) => http.post(base + '/tokens/mobile/password/retrieve', params)

/**
 * 修改密码
 */
export const changePasswrod = (params) => http.post(base + '/tokens/mobile/password/reset', params)

/**
 * 通过邮箱找回密码
 */
export const foundByEmail = (params) => http.post(base + '/emails/reset/verify', params)

/**
 * 通过类型获取邮箱验证码
 */
export const getEmailCodeByType = (params) => http.post(base + '/emails/code', params)

/**
 * 修改邮箱
 */
export const changeEmail = (params) => http.post(base + '/emails/set/', params)

/**
 * 获取登入历史
 */
export const getLoginHistory = (params) => http.get(base + '/users/current/loginHistory', params)

/**
 * 获取上传参数
 */
export const getUploadParam = (params) => http.get(base + '/users/qiniutoken', params)

/**
 * 上传图片
 */
export const uploadImg = (param, config) => http.upload('http://up.qiniu.com', param, config)

/**
 * 上传图片
 */
export const auther = (param, config) => http.post(base + '/users/cloud/auth', param, config)

/**
 * 获取收款方式列表
 */
export const getReceipts = (param) => http.get(base + '/users/payment/receipts', param)

/**
 * 添加收款方式
 */
export const getAddReceipts = (param) => http.post(base + '/users/payment/receipts', param)

/**
 * 添加收款方式
 */
export const changeReceipts = (param) => http.post(base + '/users/payment/receipts/status', param)

/**
 * 获取是否认证完
 */
export const getIsAuthered = (param) => http.get(base + '/users/cloud/status', param)

/**
 * 获取用户资产
 */
export const getUserAsset = (param) => http.get(base + '/users/exchange/balance/all', param)

/**
 * 获取用户委托
 */
export const getEntrusList = (param) => http.get(base + '/exchange/orders/order/history', param)

export const getCoinTigerList = (param) => http.get('/exchange/trading/api/v2/currencys', param)

export const getTokenCanList = (param) => http.get('/exchange-open-api/open/api/common/symbols', param)

export const getCointigerDetail = (param) => http.get('/exchange/trading/api/market/detail', param)

export const getTokenCanDetail = (param) => http.get('/exchange-open-api/open/api/get_ticker', param)

export const getEntrustList = (param) => http.get('/exchange/trading/api/market/depth', param)

export const entrust = (param) => http.post(base + '/exchange/orders/', param)

export const getEntrustListBySymbol = (param) => http.get(base + '/exchange/orders/', param)

export const getEntrustListAll = (param) => http.get(base + '/exchange/orders/all', param)

export const cancelEntrust = (param) => http.post(base + '/exchange/orders/order/canceled', param)

export const getAllSymobl = (param) => http.get(base + '/symbols/all', param)

export const getExchangeList = (param) => http.get(base + '/exchanges/', param)

export const getKline = (param) => http.get(base + '/market/klines', param)

export const getOrderList = (param) => http.get(base + '/otc/businesses', param)

export const makeOtcOrder = (param) => http.post(base + '/otc/orders', param)

export const myOtcOrderList = (param) => http.get(base + '/otc/orders', param)

export const cancelOtcOrder = (param) => http.post(base + ' /exchange/orders/order/canceled', param)
