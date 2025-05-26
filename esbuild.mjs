import * as esbuild from 'esbuild'
import copyStaticFiles from 'esbuild-copy-static-files'
import { postcssModules, sassPlugin } from 'esbuild-sass-plugin'

const env = process.env.NODE_ENV || 'development'

const plugins = [
  sassPlugin({ filter: /\.module\.s?css$/, transform: postcssModules({}) }),
  sassPlugin({ filter: /\.scss$/ }),
  copyStaticFiles({
    src: './fe/public',
    dest: './fe/dist',
    recursive: false
  })
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
  // globalName: 'dicegame',
  target: ['chrome84', 'firefox78', 'safari12', 'edge44', 'opera66'],
  publicPath: '/'
}

const ctx = await esbuild.context(esbuildContext)

if (process.argv.includes('--watch')) {
  console.log(`Building and watching ${env} build...`)

  await ctx.watch()
  await ctx.serve({ servedir: 'fe/dist', port: 8081, cors: { origin: 'http://localhost:8080' } })

  console.log('Serving on http://localhost:8081')
} else {
  console.log(`Building ${env} build...`)

  await ctx.rebuild()

  console.log('Built.')
  process.exit(0)
}
