import * as React from 'react';
import Loadable from 'react-loadable';

export default (({registerModels, app}) => {
    return Loadable.Map({
        delay: 200,
        timeout: 60000,
        loading: () => null,
        loader: {
            Index: () => import('@pages/index/aIndex'),
            Model: () => import('@pages/index/aModel'),
            Lang: () => import('@pages/index/aLang')
        },
        render(loaded, props) {
            const AIndex = loaded['Index'].default || loaded['Index'];
            const AModel = loaded['Model'].default || loaded['Model'];
            const ALang = loaded['Lang'].default || loaded['Lang'];
            
            app && registerModels(app, [AModel]);
            return <AIndex {...props} __lang={ALang} />
        }
    });
});
