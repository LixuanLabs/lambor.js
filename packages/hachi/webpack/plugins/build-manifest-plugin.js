import { RawSource } from 'webpack-sources'
import { ROUTE_NAME_REGEX, IS_BUNDLED_PAGE_REGEX, BUILD_MANIFEST, BLOCKED_NAME_REGEX } from '../../lib/constants';

export default class BuildManifestPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'HachiBuildManifest',
            (compilation, callback) => {
                const assetMap = {
                    pages: {}
                };
                const { chunks } = compilation;
                const pageManifest = {};
                for (const [urlKey, entrypoint] of compilation.entrypoints.entries()) {
                    // if (BLOCKED_PAGES.includes(urlKey)) {continue;}
                    
                    if (BLOCKED_NAME_REGEX.test(entrypoint.name)) continue;
                    const result = ROUTE_NAME_REGEX.exec(entrypoint.name);
                    console.log('result', result);
                    const pagePath = result[1];
                    
                    if (!pagePath) {
                        return
                    }
                    if (!pageManifest[`/${pagePath.replace(/\\/g, '/')}`]) {
                        pageManifest[`/${pagePath.replace(/\\/g, '/')}`] = [];
                    }
                    const filesForEntry = [];
                    // getFiles() - helper function to read the files for an entrypoint from stats object
                    for (const file of entrypoint.getFiles()) {
                        
                        if (/\.map$/.test(file) || /\.hot-update\.js$/.test(file)) {
                        continue
                        }

                        // Only `.js` and `.css` files are added for now. In the future we can also handle other file types.
                        if (!/\.js$/.test(file) && !/\.css$/.test(file)) {
                        continue
                        }

                        // The page bundles are manually added to _document.js as they need extra properties
                        if (IS_BUNDLED_PAGE_REGEX.exec(file)) {
                        continue
                        }

                        pageManifest[`/${pagePath.replace(/\\/g, '/')}`].push(file.replace(/\\/g, '/'));
                    }
                    assetMap.pages = pageManifest;
                }
                if (typeof assetMap.pages['/index'] !== 'undefined') {
                    assetMap.pages['/'] = assetMap.pages['/index']
                  }
                compilation.assets[BUILD_MANIFEST] = new RawSource(
                    JSON.stringify(assetMap, null, 2)
                )
                callback();
            }
        )
    }
}