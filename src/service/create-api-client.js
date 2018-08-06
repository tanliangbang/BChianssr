/**
 * @desc    创建客户端axios请求
 * @file    create-api-client.js
 * @author  tanliangbang
 */
import qs from 'qs'
import axios from 'axios'

axios.interceptors.response.use((res) => {
  if (res.status >= 200 && res.status < 300) {
    return res
  }
  return Promise.reject(res)
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.request.use(config => {
  return config
})

export function createAPI({ client }) {
  axios.defaults.timeout = client.timeout
  axios.defaults.baseURL = client.baseurl
  axios.defaults.withCredentials = true
  return {
    get(url, params = {}) {
      return new Promise((resolve, reject) => {
        axios({
          url,
          params,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          method: 'get'
        }).then(res => {
          resolve(res.data)
        }).catch(error => {
          resolve(error.response.data)
        })
      })
    },
    post(url, params = {}, method = 'post') {
      return new Promise((resolve, reject) => {
        axios({
          url,
          data: qs.stringify(params),
          method: method,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          resolve(res.data)
        }).catch((error) => {
          resolve(error.response.data)
        })
      })
    },
    upload (url, data, config) {
      let headers = config
      return new Promise((resolve, reject) => {
        return axios({
          method: 'post',
          url,
          data: data,
          timeout: 30000,
          headers: headers
        }).then(res => {
          resolve(res)
        }).catch(error => {
          resolve(error.response)
        })
      })
    }
  }
}
