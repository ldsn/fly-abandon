require('dotenv').config()
module.exports = appInfo => {
  const config = {
    bodyParser: {
      jsonLimit: '500kb' // 不能再大了，再大接口实在太不合理了
    },
    mongoose: {
      url: 'mongodb://127.0.0.1/fly-api'
    },
    // cookie 加密的keys
    keys: `${appInfo.name}_${process.env.cookieKey}`,
    // 密码加密的key
    md5Key: process.env.md5Key,
    // 允许跨域携带cookie
    cors: {
      credentials: true
    },
    middleware: [ 'auth' ],
    // 邮件推送间隔
    pushInterval: {
      // 一个小时内修改api不会连续推送
      api: 1000 * 60 * 60
    },
    // 发送邮件配置
    transporter: {
      appName: 'Fly 数据配置平台',
      host: 'smtp.qq.com',
      secure: true,
      port: 465,
      auth: {
        user: process.env.emailUser,
        pass: process.env.emailPass
      }
    }
  }
  return config
}
