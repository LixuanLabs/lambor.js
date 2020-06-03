import { SERVER_DIRECTORY, CLIENT_STATIC_FILES_PATH } from '../lib/constants';

export async function loadComponents (distDir, pathname) {
    const documentPath = join(
        distDir,
        SERVER_DIRECTORY,
        CLIENT_STATIC_FILES_PATH,
        'pages',
        '_document'
      )
      const appPath = join(
        distDir,
        SERVER_DIRECTORY,
        CLIENT_STATIC_FILES_PATH,
        'pages',
        '_app'
      )
    
      const DocumentMod = require(documentPath)
    
      const AppMod = require(appPath)
}