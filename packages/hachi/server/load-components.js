import { join } from 'path';
import { SERVER_DIRECTORY, CLIENT_STATIC_FILES_PATH } from '../lib/constants';
import { requirePage } from '../lib/utils';

export async function loadComponents (app, distDir, pathname) {
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
      const ComponentMod = requirePage(app, pathname, distDir, SERVER_DIRECTORY)
      

}