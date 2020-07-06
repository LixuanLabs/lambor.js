import * as React from 'react';
import * as Loadable from 'react-loadable';
import dva from 'dva';
import { hydrate } from 'react-dom';
import createHistory from 'history/createBrowserHistory';

import router from '../router';
import { generateRoutes } from '../lib/routes';

const app = dva({
    history: createHistory()
});


app.router(router);
console.log('执行');


Loadable.preloadReady().then(() => {
    const DApp = app.start();
    hydrate(
        <DApp context={{
            routesList: generateRoutes(app)
        }}/>,
        document.getElementById('__hachi')
    )
})