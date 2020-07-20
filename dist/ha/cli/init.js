"use strict";exports.__esModule=true;exports.default=void 0;var _arg=_interopRequireDefault(require("arg"));var _path=require("path");var _emptyDir=require("empty-dir");var _fs=require("fs");var _chalk=_interopRequireDefault(require("chalk"));var _through=_interopRequireDefault(require("through2"));var _leftPad=_interopRequireDefault(require("left-pad"));var _vinylFs=_interopRequireDefault(require("vinyl-fs"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function info(type,message){console.log(`${_chalk.default.green.bold((0,_leftPad.default)(type,12))}  ${message}`);}function error(message){console.error(_chalk.default.red(message));}function success(message){console.error(_chalk.default.green(message));}function template(dest,cwd){return _through.default.obj(function(file,enc,cb){if(!file.stat.isFile()){return cb();}info('create',file.path.replace(cwd+'/',''));this.push(file);cb();});}const haInit=argv=>{const args=(0,_arg.default)({// Types
'--help':Boolean,'--port':Number,'--hostname':String,// Aliases
'-h':'--help','-p':'--port','-H':'--hostname'},{argv});if(args['--help']){// tslint:disable-next-line
console.log(`
          Description
            Starts the application in production mode.
            The application should be compiled with \`next build\` first.
    
          Usage
            $ next start <dir> -p <port>
    
          <dir> represents the directory of the Next.js application.
          If no directory is provided, the current directory will be used.
    
          Options
            --port, -p      A port number on which to start the application
            --hostname, -H  Hostname on which to start the application
            --help, -h      Displays this message
        `);process.exit(0);}const dest=(0,_path.resolve)(args._[0]||'.');const projectName=(0,_path.basename)(dest);function printSuccess(){success(`
            Success! Created ${projectName} at ${dest}.
            
            Inside that directory, you can run several commands:
            * npm start: Starts the development server.
            * npm run build: Bundles the app into dist for production.
            * npm test: Run test.
            
            We suggest that you begin by typing:
            cd ${dest}
            npm start
            
            Happy hacking!`);}const cwd=(0,_path.join)(__dirname,'../../boilerplates/demo');if(!(0,_emptyDir.sync)(dest)){error('Existing files here, please run init command in an empty folder!');process.exit(1);}_vinylFs.default.src(['**/*','!node_modules/**/*'],{cwd:cwd,dot:true,cwdbase:true}).pipe(template(dest,cwd)).pipe(_vinylFs.default.dest(dest)).on('end',function(){info('rename','gitignore -> .gitignore');(0,_fs.renameSync)((0,_path.join)(dest,'gitignore'),(0,_path.join)(dest,'.gitignore'));printSuccess();}).resume();};var _default=haInit;exports.default=_default;