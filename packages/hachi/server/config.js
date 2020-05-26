import chalk from 'chalk';
import { CONFIG_FILE } from '../lib/constants'
import findUp from 'find-up';

export default function loadConfig(dir, customConfig) {
    if (customConfig) {
        return assignDefaults({ configOrigin: 'server', ...customConfig })
    }
    const path = findUp.sync(CONFIG_FILE, {
        cwd: dir,
    })
    // If config file was found
    if (path) {
        const userConfigModule = require(path)
        const userConfig = normalizeConfig(
            userConfigModule.default || userConfigModule
        )
        if (Object.keys(userConfig).length === 0) {
            console.warn(
              chalk.yellow.bold('Warning: ') +
                'Detected next.config.js, no exported configuration found. https://err.sh/zeit/next.js/empty-configuration'
            )
        }
        return assignDefaults({ configOrigin: CONFIG_FILE, ...userConfig })
    }
    return defaultConfig
}

function assignDefaults(userConfig) {
    Object.keys(userConfig).forEach((key) => {
  
      if (key === 'distDir') {
        if (typeof userConfig[key] !== 'string') {
          userConfig[key] = defaultConfig.distDir
        }
        const userDistDir = userConfig[key].trim()
  
        // don't allow public as the distDir as this is a reserved folder for
        // public files
        if (userDistDir === 'public') {
          throw new Error(
            `The 'public' directory is reserved in Next.js and can not be set as the 'distDir'. https://err.sh/zeit/next.js/can-not-output-to-public`
          )
        }
        // make sure distDir isn't an empty string as it can result in the provided
        // directory being deleted in development mode
        if (userDistDir.length === 0) {
          throw new Error(
            `Invalid distDir provided, distDir can not be an empty string. Please remove this config or set it to undefined`
          )
        }
      }
  
      if (key === 'pageExtensions') {
        const pageExtensions = userConfig[key]
  
        if (pageExtensions === undefined) {
          delete userConfig[key]
          return
        }
  
        if (!Array.isArray(pageExtensions)) {
          throw new Error(
            `Specified pageExtensions is not an array of strings, found "${pageExtensions}". Please update this config or remove it.`
          )
        }
  
        if (!pageExtensions.length) {
          throw new Error(
            `Specified pageExtensions is an empty array. Please update it with the relevant extensions or remove it.`
          )
        }
  
        pageExtensions.forEach((ext) => {
          if (typeof ext !== 'string') {
            throw new Error(
              `Specified pageExtensions is not an array of strings, found "${ext}" of type "${typeof ext}". Please update this config or remove it.`
            )
          }
        })
      }
  
      const maybeObject = userConfig[key]
      if (!!maybeObject && maybeObject.constructor === Object) {
        userConfig[key] = {
          ...(defaultConfig[key] || {}),
          ...userConfig[key],
        }
      }
    })
  
    const result = { ...defaultConfig, ...userConfig }
  
    if (typeof result.assetPrefix !== 'string') {
      throw new Error(
        `Specified assetPrefix is not a string, found type "${typeof result.assetPrefix}" https://err.sh/zeit/next.js/invalid-assetprefix`
      )
    }
    return result
}

const defaultConfig = {
    distDir: '.hachi',
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    target: 'server',
    assetPrefix: '',
    apiReg: /^\/api(?:\/|$)/
}

export function normalizeConfig(config) {
    if (typeof config === 'function') {
      config = config({ defaultConfig })
    }
    return config
}