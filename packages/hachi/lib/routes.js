 // 构建Loadable 路由系统
 // 在服务端和浏览器端都要读取routes.json文件，所以执行此文件要在服务端执行完成
 import * as React from 'react';
 import * as Loadable from 'react-loadable';
 import fs from 'fs';
 import { join } from 'path';
 import { BLOCKED_PAGES_REG } from './constants';
 console.log('process.cwd===', process.cwd());

 export const generateRoutes = (cwdDir) => {
    const routesJsonPath = join(cwdDir, 'routes.json');
    console.log('routesJsonPath', routesJsonPath);
    
    if (fs.existsSync(routesJsonPath)) {
      const routesMap = require(routesJsonPath);
      for (const key in routesMap) {
        if (BLOCKED_PAGES_REG.test(key)) continue;
        let filename = key === '/' ? 'index.js' : key + '.js';
        const aIndexPathPrefix = join(buildDir, 'pages', filename);
        console.log('aIndexPathPrefix', aIndexPathPrefix);
        
        routes.push({
            path: key,
            exact: true,
            component: Loadable.Map({
                loader: {
                  Index: () => import(aIndexPathPrefix)
                },
                delay: 2000,
                timeout: 10000,
                loading: <div>loading</div>,
                modules: [
                  aIndexPathPrefix
                ],
                webpack: [
                  aIndexPathPrefix
                ],
                render: (loaded, props) => {
                  console.log('loaded', loaded);
                  const AIndex = loaded['Index'].default || loaded['Index'];
                  const Model = loaded['Model'];
                  const Lang = loaded['Lang'].default || loaded['Lang'];
                  
                  registerModel(this.app, Model);
                  return (
                      <AIndex {...props} __lang={Lang} />
                  )
                }
            })
          })  
        
      }
    }
    return routes;
  }