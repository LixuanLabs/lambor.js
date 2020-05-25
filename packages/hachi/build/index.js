import loadConfig from '../server/config';
import {
    findPagesMapDir,
    collectPages
} from './utils'
import { createEntrypoints } from './entries';
import getBaseWebpackConfig from './webpack-config';

export default function build(dir, conf) {
    const config = loadConfig(dir, conf);
    const pagesMapDir = findPagesMapDir(dir);
    const mappedPages = await collectPages(pagesMapDir);
    const entrypoints = createEntrypoints(false, mappedPages, 'server', config);
    
}