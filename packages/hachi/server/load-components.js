import { join } from 'path';
import { SERVER_DIRECTORY, DIST_DIRECTORY } from '../lib/constants';

export async function loadComponents (app, distDir) {
    const documentPath = join(
        '__root',
        DIST_DIRECTORY,
        SERVER_DIRECTORY,
        '_document.js'
      )
    
      const DocumentMod = require(documentPath)
      
      return {
        Document: DocumentMod.default
      }
      

}