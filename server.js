const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const compression = require('compression')
const resolve = file => path.resolve(__dirname, file)
const proxyMiddleware = require('http-proxy-middleware')
const config = require('./config')
const isProd = process.env.NODE_ENV === 'production'
const app = express()

let renderer
if (isProd) {
  // 生产环境使用本地打包文件来渲染
  const bundle = require('./output/vue-ssr-bundle.json')
  const template = fs.readFileSync(resolve('./output/index.html'), 'utf-8')
  renderer = createRenderer(bundle, template)
} else {
  // 开发环境使用webpack热更新服务
  require('./build/dev-server')(app, (bundle, template) => {
    renderer = createRenderer(bundle, template)
  })
}

function createRenderer(bundle, template) {
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    template,
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

// 客户端跨域代理
const proxyTable = {
  '/api': {
    target: config.baseUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api'
    }
  },
  '/market': {
    target: 'http://154.48.249.19:8000/',
    changeOrigin: true,
    pathRewrite: {
      '^/market': '/market'
    }
  },
  '/exchange-open-api': {
    target: 'http://154.48.249.19:8001/',
    changeOrigin: true,
    pathRewrite: {
      '^/exchange-open-api': '/exchange-open-api'
    }
  },
  '/exchange': {
    target: 'http://154.48.249.19:8001/',
    changeOrigin: true,
    pathRewrite: {
      '^/exchange': '/exchange'
    }
  }

}

Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

function checkLogin(req, res) {
  let arr = ['/userCenter', '/assetManage', '/entrustManage', '/financeRecord', '/addPayWay', '/changeEmail',
    '/changePass', '/bindEmail']
  let ngtoken = req.cookies.ngtoken
  let len = arr.length
  if (!ngtoken) {
    for (let i = 0; i < len; i++) {
      if (req.url === arr[i]) {
        res.redirect('/login')
      }
    }
  }
}

const v = Date.now()
app.use(compression({ threshold: 0 }))
app.use(require('cookie-parser')())
app.use('/output', serve('./output', true))
app.use('/static', serve('./static', true))
app.use('/service-worker.js', serve('./output/service-worker.js'))
// app.use(favicon(path.resolve(__dirname, 'static/img/bangbang.ico')))

app.get('*', (req, res) => {
  checkLogin(req, res)
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }
  const s = Date.now()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/html')
  const errorHandler = err => {
    if (err && err.code === 404) {
      // 未找到页面
      res.status(404).sendfile('static/404.html')
    } else {
      // 页面渲染错误
      res.status(500).end('500 - Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err)
    }
  }

  const context = {
    title: 'lian1xia',
    keywords: 'lian1xia',
    description: 'lian1xia',
    version: v,
    url: req.url,
    cookies: req.cookies
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.log(context.url)
      console.log(err)
      return errorHandler(err)
    }
    res.end(html)
    console.log(`whole request: ${Date.now() - s}ms`)
  })
})

const port = process.env.PORT || 8888
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
