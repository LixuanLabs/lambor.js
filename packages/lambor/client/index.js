import * as React from 'react';
import * as Loadable from 'lambor-utils/loadable';
import dva from 'dva';
import { hydrate } from 'react-dom';
import createHistory from 'history/createBrowserHistory';

import router from '../router';
import { generateRoutes } from '../lib/routes';

const preLoadedState = JSON.parse(decodeURIComponent(window.__PRELOADED_STATE__ || {}));


const app = dva({
    history: createHistory(),
    initialState: preLoadedState 
});

const routesList = generateRoutes(app)


app.router(router);


Loadable.preloadReady().then(() => {
    // if (module.hot) {
    //     module.hot.accept();
    // }
    const DApp = app.start();
    hydrate(
        <DApp context={{
            routesList
        }}/>,
        document.getElementById('__ha')
    )
})
