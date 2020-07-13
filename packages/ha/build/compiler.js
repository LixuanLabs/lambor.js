import webpack from 'webpack'
import path from 'path';
import MemoryFS from 'memory-fs';
import requireFromString from 'require-from-string';
import { REACT_LOADABLE_MANIFEST, SERVER_DIRECTORY, DOCUMENTJS, ENTRY_FILES, SERVEROUTPUT } from '../lib/constants';


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

export function runCompiler(
  config,
  {
    dev = false
  }
) {
  const clientConfig = config[0];
  const serverConfig = config[1];
  return new Promise(async (resolve, reject) => {
    const compiler = webpack(config)
    if (dev) {
      const mfs = new MemoryFS();
      compiler.outputFileSystem = mfs;
      compiler.watch(
        {
          poll: true
        },
        (err, statsOrMultiStats) => {
          if (err) {
            return reject(err)
          }
          const clientDist = clientConfig.output.path;
          const serverDist = serverConfig.output.path;
          const clientBundles = require(path.resolve(clientDist, REACT_LOADABLE_MANIFEST));
          const Document = requireFromString(mfs.readFileSync(path.resolve(serverDist, DOCUMENTJS), 'utf-8')).default;
          const entryFiles = JSON.parse(mfs.readFileSync(path.resolve(clientDist, ENTRY_FILES), 'utf-8')).default;
          const Ssr = requireFromString(mfs.readFileSync(path.resolve(serverDist, SERVEROUTPUT), 'utf-8')).default;
          return resolve({
            clientBundles,
            Document,
            entryFiles,
            Ssr,
            mfs
          })
          // if ('stats' in statsOrMultiStats) {
          //   const result = statsOrMultiStats.stats.reduce(
          //     generateStats,
          //     { errors: [], warnings: [] }
          //   )
          //   return resolve(result)
          // }
  
          // const result = generateStats(
          //   { errors: [], warnings: [] },
          //   statsOrMultiStats
          // )
          // return resolve(result)
        }
      )
    } else {
      compiler.run(
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
    }
  })
}
