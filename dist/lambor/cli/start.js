#!/usr/bin/env node
"use strict";exports.__esModule=true;exports.default=void 0;var _path=require("path");var _arg=_interopRequireDefault(require("arg"));var _startServer=_interopRequireDefault(require("../server/start-server"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const haStart=argv=>{const args=(0,_arg.default)({// Types
'--help':Boolean,'--port':Number,'--hostname':String,// Aliases
'-h':'--help','-p':'--port','-H':'--hostname'},{argv});if(args['--help']){// tslint:disable-next-line
console.log(`
    Description
      Starts the application in production mode.
      The application should be compiled with \`xrdc build\` first.

    Usage
      $ xrdc start

    Options
      --port, -p      A port number on which to start the application
    `);process.exit(0);}const dir=(0,_path.resolve)(args._[0]||'.');const port=args['--port']||3000;(0,_startServer.default)({dir},port,args['--hostname']).then(async app=>{// tslint:disable-next-line
console.log(`started server on http://${args['--hostname']||'localhost'}:${port}`);}).catch(err=>{// tslint:disable-next-line
console.error(err);process.exit(1);});};var _default=haStart;exports.default=_default;