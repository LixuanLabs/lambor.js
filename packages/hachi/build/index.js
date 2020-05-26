import loadConfig from '../server/config';
import {
    findPagesMapDir,
    collectPages
} from './utils'
import { createEntrypoints } from './entries';
import getBaseWebpackConfig from './webpack-config';

export default async function build(dir) {
    const config = loadConfig(dir);
    const pagesMapDir = findPagesMapDir(dir);
    const mappedPages = await collectPages(pagesMapDir);
    const entrypoints = createEntrypoints(false, mappedPages, 'server', config);
    console.log('entrypoints', entrypoints);

    const webpackConfigs = await Promise.all([
        getBaseWebpackConfig(dir, {config, target: 'server', entrypoints}),
        getBaseWebpackConfig(dir, {config, target: 'client', entrypoints})
    ])
    console.log('webpackConfigs', webpackConfigs);
    
    
}