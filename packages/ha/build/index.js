import path from 'path';
import chalk from 'chalk';
import { promises } from 'fs';
import loadConfig from '../server/config';
// import {
//     findPagesMapDir,
//     collectPages
// } from './utils'
import { createEntrypoints } from './entries';
import getBaseWebpackConfig from './webpack-config';
import { runCompiler } from './compiler';
// import { SERVER_DIRECTORY, PAGES_MANIFEST, ROUTES_MANIFEST } from '../lib/constants';
import formatWebpackMessages from './format-webpack-messages';

export default async function build(dir) {
    const config = loadConfig(dir);
    const distDir = path.join(dir, config.distDir)
    // const pagesMapDir = findPagesMapDir(dir);
    
    // const mappedPages = await collectPages(pagesMapDir, dir);
    // const entrypoints = createEntrypoints(mappedPages);
    const entrypoints = createEntrypoints();
    
    
    await promises.mkdir(distDir, { recursive: true })
    try {
      const clientWebpackConfig = await getBaseWebpackConfig(dir, {config, target: 'client', entrypoints: entrypoints.client});
      const serverWebpackConfig = await getBaseWebpackConfig(dir, {config, target: 'server', entrypoints: entrypoints.server});
      
      let result = await runCompiler([clientWebpackConfig, serverWebpackConfig]);
      result = formatWebpackMessages(result);
      if (result.errors.length > 0) {
        throw new Error(result.errors.join('\n\n'))
      }
      if (result.warnings.length > 0) {
        console.log(chalk.yellow(result.warnings.join('\n\n')))
      }
      
      console.log(chalk.green('Compiled successfully.\n'))
    } catch (error) {
      console.error(chalk.red('Failed to compile.\n'))
      console.log(chalk.red(error.message))
    }

    // const routesManifestPath = path.join(distDir, ROUTES_MANIFEST)
    // await promises.writeFile(
    //   routesManifestPath,
    //   JSON.stringify(mappedPages),
    //   'utf8'
    // )
    // const manifestPath = path.join(distDir, SERVER_DIRECTORY, PAGES_MANIFEST)

    
    
}