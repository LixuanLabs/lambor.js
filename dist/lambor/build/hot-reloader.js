"use strict";exports.__esModule=true;exports.default=void 0;var _webpackDevMiddleware=_interopRequireDefault(require("webpack-dev-middleware"));var _webpackHotMiddleware=_interopRequireDefault(require("webpack-hot-middleware"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const ignored=[/[\\/]\.git[\\/]/,/[\\/]node_modules[\\/]/];class HotReloader{constructor(multiCompiler){const webpackDevMiddleware=(0,_webpackDevMiddleware.default)(multiCompiler,{serverSideRender:true// watchOptions: { ignored },
});const webpackHotMiddleware=(0,_webpackHotMiddleware.default)(multiCompiler.compilers[0],{log:console.log,heartbeat:2500});this.webpackDevMiddleware=webpackDevMiddleware;this.webpackHotMiddleware=webpackHotMiddleware;this.middlers=[webpackDevMiddleware,webpackHotMiddleware];// multiCompiler[1].hooks.done.tap('HotReloaderForServer', (stats) => {
//     console.log('HotReloaderForServer');
//     this.send('reloadPage')
// })
// multiCompiler.compilers[0].hooks.done.tap('HotReloaderForClient', (stats) => {
//     console.log('执行==');
//     this.send('sync')
// })
}// send = (action, ...args) => {
//     this.webpackHotMiddleware.publish({ action, data: args })
// }
async run(req,res){for(const fn of this.middlers){await new Promise((resolve,reject)=>{fn(req,res,err=>{if(err)return reject(err);resolve();});});}}}exports.default=HotReloader;