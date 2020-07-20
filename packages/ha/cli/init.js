import arg from 'arg';
import { join, resolve, basename } from 'path';
import { sync as emptyDir } from 'empty-dir';
import { renameSync } from 'fs';
import chalk from 'chalk';
import through from 'through2';
import leftPad from 'left-pad';
import vfs from 'vinyl-fs';


function info(type, message) {
    console.log(`${chalk.green.bold(leftPad(type, 12))}  ${message}`);
}

function error(message) {
    console.error(chalk.red(message));
}

function success(message) {
    console.error(chalk.green(message));
}
function template(dest, cwd) {
    return through.obj(function (file, enc, cb) {
      if (!file.stat.isFile()) {
        return cb();
      }
  
      info('create', file.path.replace(cwd + '/', ''));
      this.push(file);
      cb();
    });
}


const haInit = (argv) => {
    const args = arg(
        {
          // Types
          '--help': Boolean,
          '--port': Number,
          '--hostname': String,
    
          // Aliases
          '-h': '--help',
          '-p': '--port',
          '-H': '--hostname',
        },
        { argv }
      )
    
      if (args['--help']) {
        // tslint:disable-next-line
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
        `)
        process.exit(0)
      }
      const dest = resolve(args._[0] || '.')
      const projectName = basename(dest);
      function printSuccess() {
        success(`
            Success! Created ${projectName} at ${dest}.
            
            Inside that directory, you can run several commands:
            * npm start: Starts the development server.
            * npm run build: Bundles the app into dist for production.
            * npm test: Run test.
            
            We suggest that you begin by typing:
            cd ${dest}
            npm start
            
            Happy hacking!`);
    }
      const cwd = join(__dirname, '../../boilerplates/demo');
      if (!emptyDir(dest)) {
        error('Existing files here, please run init command in an empty folder!');
        process.exit(1);
      }
      vfs.src(['**/*', '!node_modules/**/*'], {cwd: cwd, dot: true, cwdbase: true})
      .pipe(template(dest, cwd))
      .pipe(vfs.dest(dest))
      .on('end', function() {
        info('rename', 'gitignore -> .gitignore');
        renameSync(join(dest, 'gitignore'), join(dest, '.gitignore'));
        printSuccess();
      })
      .resume();
}

export default haInit;