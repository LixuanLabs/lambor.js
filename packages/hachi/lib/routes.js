// 构建Loadable 路由系统
// 在服务端和浏览器端都要读取routes.json文件，所以执行此文件要在服务端执行完成
import * as React from 'react';
import * as Loadable from 'react-loadable';
import { join } from 'path';
import routes from '__root/routes';
import { BLOCKED_PAGES_REG } from './constants';
import { registerModel } from '../lib/utils';

const res = [];

 export const generateRoutes = () => {
    if (res.length) {
      return res;
    }
    for (const key in routes) {
      if (BLOCKED_PAGES_REG.test(key)) continue;
      const pageCom = join('/', routes[key], '/')
      
      res.push({
          path: key,
          exact: true,
          component: Loadable.Map({
              loader: {
                Index: () => import('__root' + pageCom + 'aIndex'),
                Model: () => import('__root' + pageCom + 'aModel'),
                Lang: () => import('__root' + pageCom + 'aLang')
              },
              delay: 2000,
              timeout: 10000,
              loading: <div>loading</div>,
              modules: [
                '__root' + pageCom + 'aIndex'
              ],
              webpack: [
                '__root' + pageCom + 'aIndex'
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
    return res;
}

generateRoutes();