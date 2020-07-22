#!/usr/bin/env node

import { resolve } from 'path'
import arg from 'arg'
import startServer from '../server/start-server'

const haStart = (argv) => {
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
        The application should be compiled with \`ha build\` first.

      Usage
        $ ha start <dir> -p <port>

      <dir> represents the directory of the ha.js application.
      If no directory is provided, the current directory will be used.

      Options
        --port, -p      A port number on which to start the application
        --hostname, -H  Hostname on which to start the application
        --help, -h      Displays this message
    `)
    process.exit(0)
  }

  const dir = resolve(args._[0] || '.')
  const port = args['--port'] || 3000
  startServer({ dir }, port, args['--hostname'])
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

export default haStart;
