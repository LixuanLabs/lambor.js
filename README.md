# Introduction

lambor(兰博) SSR前端开发框架

front-end server-side render framework based on [dva](https://github.com/dvajs/dva).
***
## Getting Started

```bash
#Install

$ npm install lambor -g
# or
$ yarn global add lambor
```

## Commands

We have four commands: `init`, `dev`, `build`, `start`

*create app in an empty folder with a demo*
```bash
lambor init
```

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

*run app in the development environment*
```bash
lambor dev
```

*build app in the production environment*
```bash
lambor build
```

*run app in the production environment*
```bash
lambor start
```

*Run on the production server*
```bash
pm2 start pm2-start.sh
```

### Route config example
---
```bash
import React from 'react';
import Loadable from 'lambor-utils/loadable';

export default (({registerModels, app}) => {
    return Loadable.Map({
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

```

