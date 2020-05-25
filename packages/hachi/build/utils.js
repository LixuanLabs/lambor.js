import path from 'path';
import { existsSync, promises } from 'fs';
import { BLOCKED_PAGES } from '../lib/constants';

export function findPagesMapDir(dir) {
    let curDir = path.join(dir, 'routes.json')
    if (existsSync(curDir)) return curDir
  
    curDir = path.join(dir, 'src/routes.json')
    if (existsSync(curDir)) return curDir
  
    // Check one level up the tree to see if the pages directory might be there
    if (existsSync(path.join(dir, '..', 'pages'))) {
      throw new Error(
        '> No `pages` directory found. Did you mean to run `next` in the parent (`../`) directory?'
      )
    }
  
    throw new Error(
      "> Couldn't find a `pages` directory. Please create one under the project root"
    )
}

export async function collectPages(pagesMapDir) {
    const result = await promises.readFile(pagesMapDir);
    const obj = {};
    Object.keys(result).map(key => {
        obj[key + '/aModel'] = result[key] + 'aModel.js';
        obj[key + '/aIndex'] = result[key] + 'aIndex.js';
        obj[key + '/aLang'] = result[key] + 'aLang.js';
    })
    return obj;
}