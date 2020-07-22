#!/usr/bin/env node
"use strict";exports.__esModule=true;exports.default=void 0;var _fs=require("fs");var _arg=_interopRequireDefault(require("arg"));var _path=require("path");var _build=_interopRequireDefault(require("../build"));var _utils=require("../lib/utils");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const haBuild=argv=>{const args=(0,_arg.default)({// Types
'--help':Boolean,// Aliases
'-h':'--help'},{argv});if(args['--help']){(0,_utils.printAndExit)(`
      Description
        Compiles the application for production deployment

      Usage
        $ ha build <dir>

    `,0);}const dir=(0,_path.resolve)(args._[0]||'.');// Check if the provided directory exists
if(!(0,_fs.existsSync)(dir)){(0,_utils.printAndExit)(`> No such directory exists as the project root: ${dir}`);}(0,_build.default)(dir,{dev:false}).then(()=>process.exit(0)).catch(err=>{console.error('');console.error('> Build error occurred');(0,_utils.printAndExit)(err);});};var _default=haBuild;exports.default=_default;