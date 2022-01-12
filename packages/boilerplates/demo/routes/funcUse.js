import * as React from 'react';
import Loadable from 'lambor-utils/loadable';

export default (({registerModels, app}) => {
    return Loadable.Map({
        loader: {
            Index: () => import('@pages/funcUse/aIndex'),
            Model: () => import('@pages/funcUse/aModel'),
            Lang: () => import('@pages/funcUse/aLang')
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
