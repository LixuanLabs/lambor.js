import path from 'path';
import { existsSync, promises, readFileSync } from 'fs';
import { BLOCKED_PAGES } from '../lib/constants';

export function findPagesMapDir(dir) {
    let curDir = path.join(dir, 'routes.json')
    if (existsSync(curDir)) return curDir
  
    curDir = path.join(dir, 'src/routes.json')
    if (existsSync(curDir)) return curDir
  
    // Check one level up the tree to see if the pages directory might be there
    if (existsSync(path.join(dir, '..', 'pages'))) {
      throw new Error(
        '> No `pages` directory found. Did you mean to run `hachi` in the parent (`../`) directory?'
      )
    }
  
    throw new Error(
      "> Couldn't find a `routes.json` file. Please create one under the project root"
    )
}

export async function collectPages(pagesMapDir) {
    const pagesMap = require(pagesMapDir);
    const obj = {};
    Object.keys(pagesMap).map(key => {
        obj[key + '/aModel'] = pagesMap[key] + 'aModel.js';
        obj[key + '/aIndex'] = pagesMap[key] + 'aIndex.js';
        obj[key + '/aLang'] = pagesMap[key] + 'aLang.js';
    })
    return obj;
}