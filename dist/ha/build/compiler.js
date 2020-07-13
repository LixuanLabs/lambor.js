"use strict";exports.__esModule=true;exports.runCompiler=runCompiler;var _webpack=_interopRequireDefault(require("webpack"));var _path=_interopRequireDefault(require("path"));var _memoryFs=_interopRequireDefault(require("memory-fs"));var _requireFromString=_interopRequireDefault(require("require-from-string"));var _constants=require("../lib/constants");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function generateStats(result,stat){const{errors,warnings}=stat.toJson('errors-warnings');if(errors.length>0){result.errors.push(...errors);}if(warnings.length>0){result.warnings.push(...warnings);}return result;}function runCompiler(config,{dev=false}){const clientConfig=config[0];const serverConfig=config[1];return new Promise(async(resolve,reject)=>{const compiler=(0,_webpack.default)(config);if(dev){const mfs=new _memoryFs.default();compiler.outputFileSystem=mfs;compiler.watch({poll:true},(err,statsOrMultiStats)=>{if(err){return reject(err);}const clientDist=clientConfig.output.path;const serverDist=serverConfig.output.path;const clientBundles=require(_path.default.resolve(clientDist,_constants.REACT_LOADABLE_MANIFEST));const Document=(0,_requireFromString.default)(mfs.readFileSync(_path.default.resolve(serverDist,_constants.DOCUMENTJS),'utf-8')).default;const entryFiles=JSON.parse(mfs.readFileSync(_path.default.resolve(clientDist,_constants.ENTRY_FILES),'utf-8')).default;const Ssr=(0,_requireFromString.default)(mfs.readFileSync(_path.default.resolve(serverDist,_constants.SERVEROUTPUT),'utf-8')).default;return resolve({clientBundles,Document,entryFiles,Ssr,mfs});// if ('stats' in statsOrMultiStats) {
//   const result = statsOrMultiStats.stats.reduce(
//     generateStats,
//     { errors: [], warnings: [] }
//   )
//   return resolve(result)
// }
// const result = generateStats(
//   { errors: [], warnings: [] },
//   statsOrMultiStats
// )
// return resolve(result)
});}else{compiler.run((err,statsOrMultiStats)=>{if(err){return reject(err);}if('stats'in statsOrMultiStats){const result=statsOrMultiStats.stats.reduce(generateStats,{errors:[],warnings:[]});return resolve(result);}const result=generateStats({errors:[],warnings:[]},statsOrMultiStats);return resolve(result);});}});}