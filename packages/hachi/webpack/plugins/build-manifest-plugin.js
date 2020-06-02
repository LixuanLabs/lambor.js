import { RawSource } from 'webpack-sources'
import { ROUTE_NAME_REGEX, IS_BUNDLED_PAGE_REGEX, BUILD_MANIFEST } from '../../lib/constants';

export default class BuildManifestPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'HachiBuildManifest',
            (compilation, callback) => {
                const assetMap = {
                    pages: {}
                };
                const { chunks } = compilation;
                for (const [, entrypoint] of compilation.entrypoints.entries()) {
                    const result = ROUTE_NAME_REGEX.exec(entrypoint.name);
                    const pagePath = result[1];
                    if (!pagePath) {
                        return
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

                        filesForEntry.push(file.replace(/\\/g, '/'));
                    }
                    assetMap.pages[`/${pagePath.replace(/\\/g, '/')}`] = [
                        ...filesForEntry,
                    ]
                }
                if (typeof assetMap.pages['/index'] !== 'undefined') {
                    assetMap.pages['/'] = assetMap.pages['/index']
                  }
                console.log('assetMap', assetMap);
                compilation.assets[BUILD_MANIFEST] = new RawSource(
                    JSON.stringify(assetMap, null, 2)
                )
                callback();
            }
        )
    }
}