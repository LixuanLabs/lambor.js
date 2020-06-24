import { join } from 'path'

export const PHASE_EXPORT = 'phase-export'
export const PHASE_PRODUCTION_BUILD = 'phase-production-build'
export const PHASE_PRODUCTION_SERVER = 'phase-production-server'
export const PHASE_DEVELOPMENT_SERVER = 'phase-development-server'
export const PAGES_MANIFEST = 'pages-manifest.json'
export const BUILD_MANIFEST = 'build-manifest.json'
export const EXPORT_MARKER = 'export-marker.json'
export const EXPORT_DETAIL = 'export-detail.json'
export const PRERENDER_MANIFEST = 'prerender-manifest.json'
export const ROUTES_MANIFEST = 'routes-manifest.json'
export const REACT_LOADABLE_MANIFEST = 'react-loadable-manifest.json'
export const SERVER_DIRECTORY = 'server'
export const SERVERLESS_DIRECTORY = 'serverless'
export const CONFIG_FILE = 'hachi.config.js'
export const BUILD_ID_FILE = 'BUILD_ID'
export const BLOCKED_PAGES = ['/_document', '/_app', '/_clientDocument', '/_clientApp']
export const BLOCKED_PAGES_REG = /(\/_document|\/_app|\/_clientDocument|\/_clientApp)/;
export const CLIENT_PUBLIC_FILES_PATH = 'public'
export const CLIENT_STATIC_FILES_PATH = 'static'
export const CLIENT_STATIC_FILES_RUNTIME = 'runtime'
export const AMP_RENDER_TARGET = '__NEXT_AMP_RENDER_TARGET__'
export const CLIENT_STATIC_FILES_RUNTIME_PATH = `${CLIENT_STATIC_FILES_PATH}/${CLIENT_STATIC_FILES_RUNTIME}`
// static/runtime/main.js
export const CLIENT_STATIC_FILES_RUNTIME_MAIN = `${CLIENT_STATIC_FILES_RUNTIME_PATH}/main.js`
// static/runtime/react-refresh.js
export const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = `${CLIENT_STATIC_FILES_RUNTIME_PATH}/react-refresh.js`
// static/runtime/amp.js
export const CLIENT_STATIC_FILES_RUNTIME_AMP = `${CLIENT_STATIC_FILES_RUNTIME_PATH}/amp.js`
// static/runtime/webpack.js
export const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = `${CLIENT_STATIC_FILES_RUNTIME_PATH}/webpack.js`
// static/runtime/polyfills.js
export const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = `${CLIENT_STATIC_FILES_RUNTIME_PATH}/polyfills.js`
// matches static/<buildid>/pages/<page>.js
export const IS_BUNDLED_PAGE_REGEX = /^static[/\\][^/\\]+[/\\]pages.*\.js$/
// matches static/<buildid>/pages/:page*.js
export const ROUTE_NAME_REGEX = /^static[/\\]pages[/\\](.*)[/\\](aIndex|aModel|aLang)\.(jsx|js|ts|tsx)$/
export const BLOCKED_NAME_REGEX = /^static[/\\]pages[/\\](_clientDocument|_document|_clientApp|_app)\.js$/
export const SERVERLESS_ROUTE_NAME_REGEX = /^pages[/\\](.*)\.js$/
export const TEMPORARY_REDIRECT_STATUS = 307
export const PERMANENT_REDIRECT_STATUS = 308
export const STATIC_PROPS_ID = '__N_SSG'
export const SERVER_PROPS_ID = '__N_SSP'

export const NEXT_PROJECT_ROOT = join(__dirname, '..', '..')
export const NEXT_PROJECT_ROOT_DIST = join(NEXT_PROJECT_ROOT, 'dist')
export const NEXT_PROJECT_ROOT_NODE_MODULES = join(
  NEXT_PROJECT_ROOT,
  'node_modules'
)
export const NEXT_PROJECT_ROOT_DIST_CLIENT = join(
  NEXT_PROJECT_ROOT_DIST,
  'client'
)
export const NEXT_PROJECT_ROOT_DIST_SERVER = join(
  NEXT_PROJECT_ROOT_DIST,
  'server'
)

// Regex for API routes
export const API_ROUTE = /^\/api(?:\/|$)/

// Because on Windows absolute paths in the generated code can break because of numbers, eg 1 in the path,
// we have to use a private alias
export const PAGES_DIR_ALIAS = 'private-next-pages'
export const DOT_NEXT_ALIAS = 'private-dot-next'

export const PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://err.sh/zeit/next.js/public-next-folder-conflict`

export const SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`

export const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = `You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`

export const SERVER_PROPS_SSG_CONFLICT = `You can not use getStaticProps with getServerSideProps. To use SSG, please remove getServerSideProps`

export const PAGES_404_GET_INITIAL_PROPS_ERROR = `\`pages/404\` can not have getInitialProps/getServerSideProps, https://err.sh/next.js/404-get-initial-props`

export const SERVER_PROPS_EXPORT_ERROR = `pages with \`getServerSideProps\` can not be exported. See more info here: https://err.sh/next.js/gssp-export`

export const UNSTABLE_REVALIDATE_RENAME_ERROR =
  'The `revalidate` property is not yet available for general use.\n' +
  'To try the experimental implementation, please use `unstable_revalidate` instead.\n' +
  "We're excited for you to try this feature—please share all feedback on the RFC:\n" +
  'https://nextjs.link/issg'

export const GSSP_COMPONENT_MEMBER_ERROR = `can not be attached to a page's component and must be exported from the page. See more info here: https://err.sh/next.js/gssp-component-member`

export const NON_STANDARD_NODE_ENV = `You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. https://err.sh/next.js/non-standard-node-env`

