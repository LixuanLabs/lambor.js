#!/usr/bin/env node
import { resolve } from 'path';
import { existsSync } from 'fs';
import arg from 'arg';
import { printAndExit } from '../lib/utils';

const haDev = (argv) => {
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
        `)
        process.exit(0)
      }
    
      const dir = resolve(args._[0] || '.')
    
      // Check if pages dir exists and warn if not
      if (!existsSync(dir)) {
        printAndExit(`> No such directory exists as the project root: ${dir}`)
      }
    
      const port = args['--port'] || 3000
      const appUrl = `http://${args['--hostname'] || 'localhost'}:${port}`
    
}

export default haDev