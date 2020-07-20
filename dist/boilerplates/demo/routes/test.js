import * as React from 'react';

export default function Home({registerModels, app}) {
    return {
        loader: {
            Index: () => import('../pages/test/aIndex'),
            Model: () => import('../pages/test/aModel'),
            Lang: () => import('../pages/test/aLang')
        },
        modules: [
            '../pages/test/aIndex',
            '../pages/test/aModel',
            '../pages/test/aLang'
        ],
        webpack: () => [
            require['resolveWeak']('../pages/test/aIndex'),
            require['resolveWeak']('../pages/test/aModel'),
            require['resolveWeak']('../pages/test/aLang')
        ],
        render(loaded, props) {
            const AIndex = loaded['Index'].default || loaded['Index'];
            const AModel = loaded['Model'].default || loaded['Model'];
            const ALang = loaded['Lang'].default || loaded['Lang'];
            
            app && registerModels(app, [AModel]);
            return <AIndex {...props} __lang={ALang} />
        }
    }
}