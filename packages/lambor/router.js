import * as React from 'react';
import { Router, Route, Switch } from 'dva/router';

export default function({history, context}) {
    const { routesList } = context;
    return (
        <Router history={history}>
            <Switch>
                {
                    (routesList || []).map(({path, exact, component}) => {
                        return <Route
                            key={path}
                            path={path}
                            exact={exact}
                            component={component}
                            // render={(props) => <C {...props} />}
                        />
                    })
                }
            </Switch>
        </Router>
    )
}