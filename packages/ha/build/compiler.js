import webpack, { Stats, Configuration } from 'webpack'


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
  config
) {
  return new Promise(async (resolve, reject) => {
    const compiler = webpack(config)
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
  })
}
