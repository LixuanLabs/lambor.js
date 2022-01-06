import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';

const ignored = [
    /[\\/]\.git[\\/]/,
    /[\\/]node_modules[\\/]/,
]

export default class HotReloader {
    constructor(multiCompiler) {
        const webpackDevMiddleware = WebpackDevMiddleware(
            multiCompiler,
            {
                watchOptions: { ignored },
            }
        )

        const webpackHotMiddleware = WebpackHotMiddleware(
            multiCompiler.compilers[0],
            {
                log: console.log,
                heartbeat: 2500,
            }
        )
        this.webpackDevMiddleware = webpackDevMiddleware
        this.webpackHotMiddleware = webpackHotMiddleware
        this.middlewares = [
            webpackDevMiddleware,
            webpackHotMiddleware
        ];
        // multiCompiler[1].hooks.done.tap('HotReloaderForServer', (stats) => {
        //     console.log('HotReloaderForServer');
        //     this.send('reloadPage')
        // })
        multiCompiler.compilers[0].hooks.done.tap('HotReloaderForClient', (stats) => {
            this.send('reloadPage')
        })
    }
    send = (action, ...args) => {
        this.webpackHotMiddleware.publish({ action, data: args })
    }
    async run(req, res, parsedUrl) {
        for (const fn of this.middlewares) {
            await new Promise((resolve, reject) => {
                fn(req, res, (err) => {
                    if (err) return reject(err)
                    resolve()
                })
            })
        }
    }
}