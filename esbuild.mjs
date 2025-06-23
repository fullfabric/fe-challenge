import fs from 'fs'

import * as esbuild from 'esbuild'
import copyStaticFiles from 'esbuild-copy-static-files'
import { postcssModules, sassPlugin } from 'esbuild-sass-plugin'

import postCssPlugin from '@deanc/esbuild-plugin-postcss'

const env = process.env.NODE_ENV || 'development'
const frontendHost = serverHost().replace('8080', '8081')

const plugins = [
  postCssPlugin({
    plugins: [
      /** tailwindcss */
    ]
  }),
  sassPlugin({ filter: /\.module\.s?css$/, transform: postcssModules({}) }),
  sassPlugin({ filter: /\.scss$/ }),
  copyStaticFiles({
    src: './fe/public',
    dest: './fe/dist',
    recursive: false
  }),
  setFrontendHost(frontendHost)
]

const esbuildContext = {
  plugins,
  entryPoints: ['fe/src/index.js'],
  loader: { '.js': 'jsx', '.png': 'file' },
  outdir: 'fe/dist',
  minify: env === 'production',
  bundle: true,
  sourcemap: true,
  format: 'iife',
  target: ['chrome84', 'firefox78', 'safari12', 'edge44', 'opera66'],
  publicPath: '/',
  jsx: 'automatic',
  jsxImportSource: 'react'
}

const ctx = await esbuild.context(esbuildContext)

if (process.argv.includes('--watch')) {
  console.log(`Building and watching ${env} build...`)

  await ctx.watch()
  await ctx.serve({ servedir: 'fe/dist', port: 8081, cors: { origin: serverHost() } })

  console.log(`Serving assets on ${frontendHost} | live reloading on ${serverHost()}`)
} else {
  console.log(`Building ${env} build...`)

  await ctx.rebuild()

  console.log('Built.')
  process.exit(0)
}

function setFrontendHost(host) {
  return {
    name: 'set-frontend-host',
    setup(build) {
      build.onEnd(({ errors }) => {
        if (errors.length > 0) {
          return console.warn('[setFrontendHost] Build completed with errors, skipping setting frontend host.')
        }

        const indexFile = 'fe/dist/index.html'
        const indexFileContent = fs.readFileSync(indexFile, 'utf-8').replaceAll(/%FRONTEND_HOST%/g, host)

        fs.writeFileSync(indexFile, indexFileContent)
      })
    }
  }
}

function serverHost() {
  const codespaceName = process.env.CODESPACE_NAME

  if (codespaceName) {
    const portForwardingDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    return `https://${codespaceName}-8080.${portForwardingDomain}`
  }

  return 'http://localhost:8080'
}
