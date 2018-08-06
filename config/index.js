 const isProd = process.env.NODE_ENV === 'production'

const proUrl = 'http://154.48.249.19:8300' // 生产环境api地址
const devUrl = 'http://154.48.249.19:8300' // 开发api地址

const FaceUrl = isProd ? proUrl : devUrl

module.exports = {
  baseUrl: FaceUrl,
  client: {
    baseurl: '/',
    timeout: 10000
  },
  server: {
    baseurl: FaceUrl + '/',
    timeout: 10000
  }
}
