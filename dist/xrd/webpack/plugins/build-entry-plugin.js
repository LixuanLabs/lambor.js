"use strict";exports.__esModule=true;exports.default=void 0;var _webpackSources=require("webpack-sources");var _constants=require("../../lib/constants");class BuildManifestPlugin{apply(compiler){compiler.hooks.emit.tapAsync('HaEntryFiles',(compilation,callback)=>{const assetMap={default:[]};for(const[urlKey,entrypoint]of compilation.entrypoints.entries()){for(const file of entrypoint.getFiles()){assetMap.default.push({publicPath:`/dist/${file}`});//     if (/\.map$/.test(file) || /\.hot-update\.js$/.test(file)) {
//     continue
//     }
//     if (!/\.js$/.test(file) && !/\.css$/.test(file)) {
//     continue
//     }
//     pageManifest[urlKey] = file
}}compilation.assets[_constants.ENTRY_FILES]=new _webpackSources.RawSource(JSON.stringify(assetMap,null,2));callback();});}}exports.default=BuildManifestPlugin;