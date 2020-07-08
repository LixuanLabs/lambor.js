import * as React from 'react';
import { Router, Route, Switch } from 'dva/router';

export default function({history, context}) {
    const { routesList } = context;
    console.log('routesList', routesList);
    
    return (
        <Router history={history}>
            <Switch>
                {
                    (routesList || []).map(({path, exact, component: C, ...rest}) => {
                        return <Route
                            key={path}
                            path={path}
                            exact={exact}
                            render={(props) => <C {...props} {...rest} />}
                        />
                    })
                }
            </Switch>
        </Router>
    )
}