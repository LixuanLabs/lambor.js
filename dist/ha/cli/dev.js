#!/usr/bin/env node
"use strict";exports.__esModule=true;exports.default=void 0;var _path=require("path");var _fs=require("fs");var _arg=_interopRequireDefault(require("arg"));var _utils=require("../lib/utils");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const haDev=argv=>{const args=(0,_arg.default)({// Types
'--help':Boolean,'--port':Number,'--hostname':String,// Aliases
'-h':'--help','-p':'--port','-H':'--hostname'},{argv});if(args['--help']){// tslint:disable-next-line
console.log(`
          Description
            Starts the application in development mode (hot-code reloading, error
            reporting, etc)
    
          Usage
            $ next dev <dir> -p <port number>
    
          <dir> represents the directory of the Next.js application.
          If no directory is provided, the current directory will be used.
    
          Options
            --port, -p      A port number on which to start the application
            --hostname, -H  Hostname on which to start the application
            --help, -h      Displays this message
        `);process.exit(0);}const dir=(0,_path.resolve)(args._[0]||'.');// Check if pages dir exists and warn if not
if(!(0,_fs.existsSync)(dir)){(0,_utils.printAndExit)(`> No such directory exists as the project root: ${dir}`);}const port=args['--port']||3000;const appUrl=`http://${args['--hostname']||'localhost'}:${port}`;};var _default=haDev;exports.default=_default;