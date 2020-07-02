import path from 'path';
import { generateRoutes } from '../../lib/routes';
import { RawSource } from 'webpack-sources'

export default class RoutesManifestPlugin {
    constructor({isServer}) {
        this.isServer = isServer
    }
    apply(compiler) {
        compiler.hooks.emit.tap('HaRoutesManifest', (compilation) => {
            const outputPath = compiler.outputPath.split('/.ha');
            
            const routes = generateRoutes(outputPath[0], this.isServer)
            console.log('routes', routes);
            
            compilation.assets['routes.js'] = new RawSource(
                JSON.stringify(routes, null, 2)
            );
        })
    }
}
