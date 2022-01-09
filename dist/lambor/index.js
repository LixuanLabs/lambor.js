#!/usr/bin/env node
"use strict";var _arg=_interopRequireDefault(require("arg"));var _fs=_interopRequireDefault(require("fs"));var _path=_interopRequireDefault(require("path"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const packageJson=_fs.default.readFileSync(_path.default.resolve(__dirname,'../../package.json'));const args=(0,_arg.default)({// Types
'--version':Boolean,'--help':Boolean,// Aliases
'-v':'--version','-h':'--help'},{permissive:true});const commands={build:true,dev:true,start:true,init:true};if(args['--help']){// tslint:disable-next-line
console.log(`
    Description
        create app in an empty folder with a demo
    Usage
        $ lambor init

    Description
        Starts the application in development mode (hot-code reloading, error
        reporting, etc)

    Usage
        $ lambor dev

    Description
        build app in the production mode
    Usage
        $ lambor build

    `);process.exit(0);}if(args['--version']){console.log(`
    Version: ${packageJson.version}
    `);process.exit(0);}const foundCommand=Boolean(commands[args._[0]]);if(!foundCommand){console.log(`
    Description
        create app in an empty folder with a demo
    Usage
        $ lambor init

    Description
        Starts the application in development mode (hot-code reloading, error
        reporting, etc)

    Usage
        $ lambor dev

    Description
        build app in the production mode
    Usage
        $ lambor build

    `);process.exit(0);}const command=args._[0];const forwardedArgs=foundCommand?args._.slice(1):args._;const defaultEnv=command==='dev'?'development':'production';process.env.NODE_ENV=process.env.NODE_ENV||defaultEnv;if(command==='build'){const comBuild=require('./cli/build').default;comBuild(forwardedArgs);}if(command==='dev'){const comDev=require('./cli/dev').default;comDev(forwardedArgs);}if(command==='start'){const comStart=require('./cli/start').default;comStart(forwardedArgs);}if(command==='init'){const comInit=require('./cli/init').default;comInit(forwardedArgs);}