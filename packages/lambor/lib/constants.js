import { join } from 'path'

export const ENTRY_FILES = 'entry-files.json'
export const BUILD_MANIFEST = 'build-manifest.json'
export const ROUTES_MANIFEST = 'routes-manifest.json'
export const REACT_LOADABLE_MANIFEST = 'lambor-manifest.json'
export const DIST_DIRECTORY = '.lambor'
export const SERVER_DIRECTORY = 'server'
export const CONFIG_FILE = 'lambor.config.js'
export const BLOCKED_PAGES = ['/_document', '/_app', '/_clientDocument', '/_clientApp'];
export const BLOCKED_PAGES_REG = /(\/_document|\/_app|\/_clientDocument|\/_clientApp)/;
export const DOCUMENTJS = '_document.js';
export const SERVEROUTPUT = 'server.js';
