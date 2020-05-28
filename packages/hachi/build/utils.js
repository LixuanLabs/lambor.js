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

export async function collectPages(pagesMapDir, dir) {
    const pagesMap = require(pagesMapDir);
    const obj = {};
    Object.keys(pagesMap).map(key => {
      const preKey = pagesMap[key].split('pages')[1];
        obj[path.join(preKey, 'aModel')] = path.join(dir, pagesMap[key], 'aModel.js');
        obj[path.join(preKey, 'aIndex')] = path.join(dir, pagesMap[key], 'aIndex.jsx');
        obj[path.join(preKey, 'aLang')] = path.join(dir, pagesMap[key], 'aLang.js');
    })
    return obj;
}