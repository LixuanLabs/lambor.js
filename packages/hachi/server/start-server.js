import http from 'http';
import * as Loadable from 'react-loadable';
import path from 'path';

export default async function start(
  serverOptions,
  port,
  hostname
) {
  const controllerModule = require(path.join(process.cwd(), './.ha/server/server.js'));
  const Controller = controllerModule.default || controllerModule;
  const app = new Controller({
    ...serverOptions,
    customServer: false,
  })
  await Loadable.preloadAll()
  
  const srv = http.createServer(app.handleRequest)
  await new Promise((resolve, reject) => {
    // This code catches EADDRINUSE error if the port is already in use
    srv.on('error', reject)
    srv.on('listening', () => resolve())
    srv.listen(port, hostname)
  })
  // It's up to caller to run `app.prepare()`, so it can notify that the server
  // is listening before starting any intensive operations.
  return app
}
