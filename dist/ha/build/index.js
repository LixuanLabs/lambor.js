"use strict";exports.__esModule=true;exports.default=build;var _path=_interopRequireDefault(require("path"));var _chalk=_interopRequireDefault(require("chalk"));var _fs=require("fs");var _config=_interopRequireDefault(require("../server/config"));var _entries=require("./entries");var _webpackConfig=_interopRequireDefault(require("./webpack-config"));var _compiler=require("./compiler");var _formatWebpackMessages=_interopRequireDefault(require("./format-webpack-messages"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// import {
//     findPagesMapDir,
//     collectPages
// } from './utils'
// import { SERVER_DIRECTORY, PAGES_MANIFEST, ROUTES_MANIFEST } from '../lib/constants';
async function build(dir,{dev=false}){const config=(0,_config.default)(dir);const distDir=_path.default.join(dir,config.distDir);// const pagesMapDir = findPagesMapDir(dir);
// const mappedPages = await collectPages(pagesMapDir, dir);
// const entrypoints = createEntrypoints(mappedPages);
const entrypoints=(0,_entries.createEntrypoints)();await _fs.promises.mkdir(distDir,{recursive:true});try{const clientWebpackConfig=await(0,_webpackConfig.default)(dir,{config,target:'client',entrypoints:entrypoints.client});const serverWebpackConfig=await(0,_webpackConfig.default)(dir,{config,target:'server',entrypoints:entrypoints.server});let result=await(0,_compiler.runCompiler)([clientWebpackConfig,serverWebpackConfig],{dev});result=(0,_formatWebpackMessages.default)(result);if(result.errors.length>0){throw new Error(result.errors.join('\n\n'));}if(result.warnings.length>0){console.log(_chalk.default.yellow(result.warnings.join('\n\n')));}console.log(_chalk.default.green('Compiled successfully.\n'));}catch(error){console.error(_chalk.default.red('Failed to compile.\n'));console.log(_chalk.default.red(error.message));}// const routesManifestPath = path.join(distDir, ROUTES_MANIFEST)
// await promises.writeFile(
//   routesManifestPath,
//   JSON.stringify(mappedPages),
//   'utf8'
// )
// const manifestPath = path.join(distDir, SERVER_DIRECTORY, PAGES_MANIFEST)
}