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

const routesList = generateRoutes(app)


app.router(router);


Loadable.preloadReady().then(() => {
    const DApp = app.start();
    hydrate(
        <DApp context={{
            routesList
        }}/>,
        document.getElementById('__hachi')
    )
})