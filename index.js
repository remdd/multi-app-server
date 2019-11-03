const express = require('express'),
  // httpProxy = require('http-proxy')
  proxy = require('http-proxy-middleware')
  path = require('path')
  kill = require('kill-port')

const wrapperApp = express()
// const apiProxy = httpProxy.createProxyServer()

var fork = require('child_process').fork

const config = require('./config.json')
for (app of config.apps) {
  console.log("Creating proxy...")
  wrapperApp.use(app.route, proxy({
    target: `${config.rootUrl}:${app.port}`,
    pathRewrite: (appPath, req) => {
      console.log(`appPath: ${appPath}`)
      return appPath
    }
  }))

  console.log("Forking...")
  kill(`${app.port}`)
  fork(`./${app.entrypoint}`, {
    cwd: `${app.dir}`
  })
  // const appPath = `${config.rootUrl}:${app.port}`
  // wrapperApp.all(`${app.route}/*`, (req, res) => {
  //   console.log(`Redirecting to ${app.name}`)
  //   apiProxy.web(req, res, {target: appPath})
  // })
}

wrapperApp.listen(80, () => {
  console.log("Proxy listening on port 80")
})
