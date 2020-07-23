# xrdc.js


front-end framework based on [dva](https://github.com/dvajs/dva), [react-loadable](https://github.com/jamiebuilds/react-loadable).

## Getting Started

```bash
#Install

$ npm install xrdc -g
# or
$ yarn global add xrdc
```

## Commands

We have four commands: `init`, `dev`, `build`, `start`

### xrdc init
create app in an empty folder with a demo

#### Generated File Tree
```bash
.
├── pages                    # pages directory
    ├── index               # page
        ├── aIndex.jsx         # UI components
        ├── aModel.js          # Dva models for entry file
        ├── aLang.js         # Lang for entry file
├── routes                    # Source directory
    ├── index.js           # Route map Enry file
    ├── home.js             # Loadable Config
├── .gitignore             #
└── package.json           #
```

### xrdc dev
run app in the development mode

### xrdc build
build app in the production mode

### xrdc start
run app in the production mode

### Route config example
---
```bash
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
```

