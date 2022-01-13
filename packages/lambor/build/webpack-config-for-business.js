const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge')
const { UtilsLoadablePlugin } = require('lambor-utils/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {babelClientOpts, babelServerOpts} = require('./babel-config-for-business');

import BuildEntryPlugin from '../webpack/plugins/build-entry-plugin';
const { REACT_LOADABLE_MANIFEST } = require('../lib/constants');

export default async function getBaseWebpackConfig(
    dir,
    {
        config,
        target = 'server',
        entrypoints,
        dev = false
    }
) {
    const distDir = path.join(dir, config.distDir)
    const customWebpackConfig = config.webpack({dev, target});
    const commonWebpackConfig = getCommonConfig({entrypoints, distDir, target, dev});
    if (target === 'server') {
        const serverWebpackConfig = merge(getServerConfig(distDir, dev), customWebpackConfig, commonWebpackConfig)
        return serverWebpackConfig;
    }
    const clientWebpackConfig = merge(getClientConfig(distDir, dev), customWebpackConfig, commonWebpackConfig);
    return clientWebpackConfig;
}

function getCommonConfig({entrypoints, distDir, target, dev}) {
    return {
        entry: entrypoints,
        target: target === 'server' ? 'node' : 'web',
        output: {
            filename: dev ? '[name].js' : target === 'server' ? '[name].js' : '[name].[chunkhash].js',
            publicPath: '/dist/',
        },
        resolve: {
            alias: {
                '@': process.cwd(),
                '@pages': path.resolve(process.cwd(), './pages'),
                'lambor/document': path.resolve(__dirname, '../server/pages/_document'),
                
            },
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        node: {
            __dirname: true
        },
        mode: dev ? 'development' : 'production',
        module: {
            rules: [{
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [
                    // 'thread-loader',
                    {
                        loader: require.resolve('babel-loader'),
                        options: target === 'server' ? babelServerOpts : babelClientOpts
                    },
                ]
            }, {
                test: /\.(png|jpe?g|gif|woff|eot|ttf|woff2|svg)$/i,
                use: [
                  {
                    loader: require.resolve('file-loader'),
                  },
                ],
              },]
        },
    }
}

function getServerConfig(distDir) {
    const outputPath = path.join(distDir, 'server');
    return {
        output: {
            libraryTarget: 'commonjs2',
            path: outputPath
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    {from: path.join(__dirname, '../server/pages'), to: outputPath}
                ]
            }),
            new webpack.DefinePlugin({
                __IS_SERVER__: JSON.stringify(true)
            }),
        ],
    }
}

function getClientConfig(distDir, dev) {
    const config = {
        output: {
            path: distDir
        },
        plugins: [
            new CleanWebpackPlugin(),
            new BuildEntryPlugin(),
            new webpack.DefinePlugin({
                __IS_SERVER__: JSON.stringify(false)
            }),
            new UtilsLoadablePlugin({
                filename: REACT_LOADABLE_MANIFEST,
            }),
        ],
        optimization: {
            nodeEnv: dev ? 'development' : 'production',
            // runtimeChunk: {
            //     name: 'runtime'
            // }
            runtimeChunk: true
        },
    }
    if (dev) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin())
    } else {
        config.optimization.splitChunks = {
            chunks: 'all'
        }
    }
    return config;
}
