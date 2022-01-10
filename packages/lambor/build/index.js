import path from 'path';
import chalk from 'chalk';
import { promises } from 'fs';
import loadConfig from '../server/config';
import { createEntrypoints } from './entries';
import getBaseWebpackConfig from './webpack-config-for-business';
import { runCompiler, devRunCompiler } from './compiler';
import formatWebpackMessages from './format-webpack-messages';

export default async function build(dir, {
  dev = false
}) {
    const config = loadConfig(dir);
    const distDir = path.join(dir, config.distDir)

    const entrypoints = createEntrypoints({dev});
    
    await promises.mkdir(distDir, { recursive: true })
    try {
      const [clientWebpackConfig, serverWebpackConfig] = await Promise.all([
        getBaseWebpackConfig(dir, {config, target: 'client', entrypoints: entrypoints.client, dev}),
        getBaseWebpackConfig(dir, {config, target: 'server', entrypoints: entrypoints.server, dev})
      ])
      if (dev) {
        return await devRunCompiler([clientWebpackConfig, serverWebpackConfig]);
      } else {
        let result = await runCompiler([clientWebpackConfig, serverWebpackConfig]);
        result = formatWebpackMessages(result);
        if (result.errors.length > 0) {
          throw new Error(result.errors.join('\n\n'))
        }
        if (result.warnings.length > 0) {
          console.log(chalk.yellow(result.warnings.join('\n\n')))
        }
      }
      console.log(chalk.green('Compiled successfully.\n'))
    } catch (error) {
      console.error(chalk.red('Failed to compile.\n'))
      console.log('error', error);
      console.log(chalk.red(error.message))
    }    
    
}
