import webpack from 'webpack'
import path, { resolve } from 'path';
import MemoryFS from 'memory-fs';
import requireFromString from 'require-from-string';
import { REACT_LOADABLE_MANIFEST, SERVER_DIRECTORY, DOCUMENTJS, ENTRY_FILES, SERVEROUTPUT } from '../lib/constants';
import HotReloader from '../build/hot-reloader';


function generateStats(result, stat) {
  const { errors, warnings } = stat.toJson('errors-warnings')
  if (errors.length > 0) {
    result.errors.push(...errors)
  }

  if (warnings.length > 0) {
    result.warnings.push(...warnings)
  }

  return result
}

export async function devRunCompiler([clientConfig, serverConfig]) {
  const clientDist = clientConfig.output.path;
  const serverDist = serverConfig.output.path;
  const serverMFS = new MemoryFS();
  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);
  const hotReloader = new HotReloader([clientCompiler, serverCompiler]);
  serverCompiler.outputFileSystem = serverMFS;
  function clientCompile() {
    return new Promise((resolve, reject) => {
      clientCompiler.hooks.done.tap('done', () => {
        const clientMFS = hotReloader.webpackDevMiddleware.fileSystem;
        const entryFiles = JSON.parse(clientMFS.readFileSync(path.resolve(clientDist, ENTRY_FILES), 'utf-8')).default;
        const clientBundles = require(path.resolve(clientDist, REACT_LOADABLE_MANIFEST));
        resolve({
          entryFiles,
          clientBundles
        });
      })
    })
  }
  function serverCompile() {
    return new Promise((resolve, reject) => {
      serverCompiler.watch({}, (err) => {
        if (err) return reject(err);
        const Document = requireFromString(serverMFS.readFileSync(path.resolve(serverDist, DOCUMENTJS), 'utf-8')).default;
        const Ssr = requireFromString(serverMFS.readFileSync(path.resolve(serverDist, SERVEROUTPUT), 'utf-8')).default;
        resolve({
          Document,
          Ssr
        })
      })
    })
  }
  try {
    const { entryFiles, clientBundles } = await clientCompile();
    const { Document, Ssr } = await serverCompile();
    return {
      clientBundles,
      Document,
      entryFiles,
      Ssr,
      mfs: hotReloader.webpackDevMiddleware.fileSystem,
      hotReloader
    }  
  } catch (error) {
    console.log('error', error); 
  }
}

export function runCompiler(
  config,
  {
    dev = false
  }
) {
  const multiCompiler = webpack(config)
  return new Promise(async (resolve, reject) => {
    multiCompiler.run(
      (err, statsOrMultiStats) => {
        if (err) {
          return reject(err)
        }

        if ('stats' in statsOrMultiStats) {
          const result = statsOrMultiStats.stats.reduce(
            generateStats,
            { errors: [], warnings: [] }
          )
          return resolve(result)
        }

        const result = generateStats(
          { errors: [], warnings: [] },
          statsOrMultiStats
        )
        return resolve(result)
      }
    )
  })
}
