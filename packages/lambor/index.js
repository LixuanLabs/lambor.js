#!/usr/bin/env node
import arg from 'arg';
import comBuild from './cli/build';
import comDev from './cli/dev';
import comStart from './cli/start';
import comInit from './cli/init';
import fs from 'fs';
import path from 'path';

const packageJson = fs.readFileSync(path.resolve(__dirname, '../../package.json'));

const args = arg(
    {
        // Types
        '--version': Boolean,
        '--help': Boolean,
    
        // Aliases
        '-v': '--version',
        '-h': '--help',
    },
    {
        permissive: true,
    }
);


const commands = {
    build: comBuild,
    dev: comDev,
    start: comStart,
    init: comInit
}

console.log('args._[0]', args);
if (args['--help']) {
    // tslint:disable-next-line
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

    `)
    process.exit(0);
}

if (args['--version']) {
    console.log(`
    Version: ${packageJson.version}
    `)
    process.exit(0);
}

const foundCommand = Boolean(commands[args._[0]])
if (!foundCommand) {
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

    `)
    process.exit(0);
}

const command = args._[0];
const forwardedArgs = foundCommand ? args._.slice(1) : args._;
const defaultEnv = command === 'dev' ? 'development' : 'production';
process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv

commands[command](forwardedArgs);

