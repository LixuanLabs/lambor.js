import { RawSource } from 'webpack-sources'
import { ENTRY_FILES } from '../../lib/constants';

export default class BuildManifestPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'HaEntryFiles',
            (compilation, callback) => {
                const assetMap = {
                    default: []
                };

                for (const [urlKey, entrypoint] of compilation.entrypoints.entries()) {
                    for (const file of entrypoint.getFiles()) {
                        assetMap.default.push({
                            publicPath: `/dist/${file}`
                        })    
                    //     if (/\.map$/.test(file) || /\.hot-update\.js$/.test(file)) {
                    //     continue
                    //     }
                    //     if (!/\.js$/.test(file) && !/\.css$/.test(file)) {
                    //     continue
                    //     }

                    //     pageManifest[urlKey] = file
                    }
                }
                compilation.assets[ENTRY_FILES] = new RawSource(
                    JSON.stringify(assetMap, null, 2)
                )
                callback();
            }
        )
    }
}