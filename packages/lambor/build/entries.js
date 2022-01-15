import { join } from 'path'

export function createEntrypoints({dev}) {
  if (dev) {
    // ?path=/__webpack_hmr&timeout=20000&reload=true'
    return {
      client: [require.resolve('webpack-hot-middleware/client').concat('?path=/__webpack_hmr&timeout=20000&reload=true'), join(__dirname, '../client/index.js')],
      server: {
        server: [join(__dirname, '../server/ssr.js')],
      }
    }
  }
  
  return {
    client: {
      client: [join(__dirname, '../client/index.js')]
    },
    server: {
      server: join(__dirname, '../server/ssr.js'),
    }
  }
}
