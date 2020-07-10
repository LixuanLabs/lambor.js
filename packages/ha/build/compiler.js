import webpack, { Stats, Configuration } from 'webpack'
import MemoryFS from 'memory-fs';


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
  return new Promise(async (resolve, reject) => {
    const compiler = webpack(config)
    if (dev) {
      compiler.outputFileSystem = new MemoryFS();
      compiler.watch(
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
