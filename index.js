const express = require('express'),
  dotenv = require('dotenv'),
  proxy = require('http-proxy-middleware'),
  kill = require('kill-port')

dotenv.config({path: '.env'});
const config = require('./config.json')

const wrapperApp = express()
const PORT = process.env.PORT || 3000

var fork = require('child_process').fork


for (app of config.apps) {
  //  Launch app process
  console.log(`\nForking ${app.name} at port ${app.port}`)
  kill(app.port)
  fork(`./${app.entrypoint}`, {
    cwd: `${app.dir}`,
    env: { PORT: app.port }
  })

  // const context = `${app.route}/**`
  // console.log(context)
  // const target = `${process.env.ROOTURL}:${app.port}/`
  // console.log(target)

  // const options = {
  //   target: target,
  //   changeOrigin: true,
  //   prependPath: true,
  //   pathRewrite: {
  //     [`^${process.env.ROOTURL}:${PORT}`]: `${process.env.ROOTURL}:${app.port}`
  //   }
  // }
  // const appProxy = proxy(options)

  // wrapperApp.use(context, appProxy)










  //  Working redirect
  wrapperApp.get(app.route, (req, res) => {
    const target = `${process.env.ROOTURL}:${app.port}`
    console.log(target)
    res.redirect(target)
  })
}

wrapperApp.listen(PORT, () => {
  console.log(`Wrapper app listening on port ${PORT}`)
})
