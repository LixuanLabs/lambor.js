import * as React from 'react';

export default function Home({registerModels, app}) {
    return {
        loader: {
            Index: () => import('../pages/index/aIndex'),
            Model: () => import('../pages/index/aModel'),
            Lang: () => import('../pages/index/aLang')
        },
        modules: [
            '../pages/index/aIndex',
            '../pages/index/aModel',
            '../pages/index/aLang'
        ],
        webpack: () => [
            require['resolveWeak']('../pages/index/aIndex'),
            require['resolveWeak']('../pages/index/aModel'),
            require['resolveWeak']('../pages/index/aLang')
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