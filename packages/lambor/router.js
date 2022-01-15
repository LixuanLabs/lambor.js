import * as React from 'react';
import { Router, Route, Routes } from 'react-router-dom';

export default function({history, context}) {
    const { routesList } = context;
    return (
        <Router location={history.location}>
            <Routes>
                {
                    (routesList || []).map(({path, component: C}) => {
                        return <Route
                            key={path}
                            path={path}
                            element={<C />}
                        >
                        </Route>
                    })
                }
            </Routes>
        </Router>
    )
}
