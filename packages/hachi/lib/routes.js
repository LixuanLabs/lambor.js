// 构建Loadable 路由系统
// 在服务端和浏览器端都要读取routes.json文件，所以执行此文件要在服务端执行完成
import * as React from 'react';
import * as Loadable from 'react-loadable';
import routes from '__root/routes';
import { BLOCKED_PAGES_REG } from './constants';
import { registerModel } from '../lib/utils';

const res = [];

 export const generateRoutes = (app) => {
    if (res.length) {
      return res;
    }
    
    
    for (const key in routes) {
      if (BLOCKED_PAGES_REG.test(key)) continue;
      // const pageCom = join('/', routes[key], '/')
      
      res.push({
          path: key,
          exact: true,
          component: Loadable.Map(routes[key]({registerModel, app}))
      })  
      
    }
    return res;
}

if (__IS_SERVER__) {
  // generateRoutes();
}