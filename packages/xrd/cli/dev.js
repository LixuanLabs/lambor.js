#!/usr/bin/env node
import { resolve } from 'path';
import { existsSync } from 'fs';
import arg from 'arg';
import startServer from '../server/start-server'
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
          $ xrd dev
        `)
        process.exit(0)
      }
    
      const dir = resolve(args._[0] || '.')
    
      // Check if pages dir exists and warn if not
      if (!existsSync(dir)) {
        printAndExit(`> No such directory exists as the project root: ${dir}`)
      }
    
      const port = args['--port'] || 3000
      startServer({ dir, dev: true }, port, args['--hostname'])
        .then(async (app) => {
          // tslint:disable-next-line
          console.log(
            `started server on http://${args['--hostname'] || 'localhost'}:${port}`
          )
        })
        .catch((err) => {
          // tslint:disable-next-line
          console.error(err)
          process.exit(1)
        })
    
}

export default haDev