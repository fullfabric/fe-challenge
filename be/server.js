require('./models')

const cors = require('@koa/cors')

const app = require('./')
const sequelize = require('./sequelize')

module.exports = (async () => {
  await sequelize.sync()

  console.log('Database synced')

  app.listen(8080, () => {
    console.log('Serving game UI + API on http://localhost:8080')
  })

  const codespaceName = process.env.CODESPACE_NAME

  if (codespaceName) {
    const portForwardingDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    const origin = `https://${codespaceName}-8080.${portForwardingDomain}`

    app.use(cors({ origin, allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'] }))

    console.log(`CORS enabled for ${origin}`)
  }
})()
