import * as React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { BLOCKED_PAGES_REG } from './lib/constants';

export default function({history, context}) {
    const { routesList, Document, App } = context;
    return (
        <Router history={history}>
            <Switch>
                {
                    (routesList || []).filter(({path}) => !BLOCKED_PAGES_REG.test(path)).map(({path, exact, component: C, ...rest}) => {
                        return <Route
                            key={path}
                            path={path}
                            exact={exact}
                            render={(props) => {
                                const { location } = props;
                                return Document.renderDocument(Document,
                                    {
                                        page: location.pathname,
                                        children: (
                                            <C {...props} {...rest} />
                                        )
                                    }
                                )
                                
                            }}
                        />
                    })
                }
            </Switch>
        </Router>
    )
}