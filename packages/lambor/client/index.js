import * as React from 'react';
import Loadable from 'lambor-utils/loadable';
import dva from 'dva';
import { hydrate } from 'react-dom';
import { createBrowserHistory } from 'history';

import router from '../router';
import { generateRoutes } from '../lib/routes';

const preLoadedState = JSON.parse(decodeURIComponent(window.__PRELOADED_STATE__ || {}));


const app = dva({
    history: createBrowserHistory(),
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
