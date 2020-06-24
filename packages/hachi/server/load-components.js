import { join } from 'path';
import { SERVER_DIRECTORY, CLIENT_STATIC_FILES_PATH } from '../lib/constants';
import { requirePage } from '../lib/utils';

export async function loadComponents (app, distDir, routesMap) {
    const documentPath = join(
        distDir,
        SERVER_DIRECTORY,
        '_document'
      )
      const appPath = join(
        distDir,
        SERVER_DIRECTORY,
        '_app'
      )
    
      const DocumentMod = require(documentPath)
      const AppMod = require(appPath)
      const routesList = [];
      for (const route in routesMap) {
        if (routesMap.hasOwnProperty(route)) {
          const pageCom = await requirePage(app, route, distDir, SERVER_DIRECTORY);
          routesList.push({
            path: route,
            exact: true,
            component: pageCom.default
          });
        }
      }
      return {
        Document: DocumentMod.default,
        App: AppMod.default,
        routesList
      }
      

}