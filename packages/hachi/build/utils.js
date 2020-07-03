import path from 'path';
import glob from 'glob';
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
    const urlPagesMap = {};
    Object.keys(pagesMap).map(key => {
      if (BLOCKED_PAGES.includes(key)) {
        urlPagesMap[key] = path.join(dir, pagesMap[key]);
        return;
      }
      urlPagesMap[key] = glob.sync(`${path.join(dir, pagesMap[key])}/{aIndex,aLang,aModel}.*`);
    })
    
    return urlPagesMap;
}

export async function collectBlockPages(pagesMapDir, dir) {
    const pagesMap = require(pagesMapDir);
    const urlPagesMap = {};
    Object.keys(pagesMap).map(key => {
      if (BLOCKED_PAGES.includes(key)) {
        urlPagesMap[key] = path.join(dir, pagesMap[key]);
      }
    })
    return urlPagesMap;
}