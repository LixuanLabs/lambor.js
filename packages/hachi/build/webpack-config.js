const path = require('path');
const webpack = require('webpack');
const {babelClientOpts, babelServerOpts} = require('./babel-config');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
// import BuildManifestPlugin from '../webpack/plugins/build-manifest-plugin';
// import PagesManifestPlugin from '../webpack/plugins/pages-manifest-plugin';
// import RoutesManifestPlugin from '../webpack/plugins/routes-manifest-plugin';
const { REACT_LOADABLE_MANIFEST } = require('../lib/constants');

export default async function getBaseWebpackConfig(
    dir,
    {
        config,
        target = 'server',
        entrypoints
    }
) {
    const distDir = path.join(dir, config.distDir)
    const plugins = [];
    const output = {}
    const optimization = {};
    if (target === 'server') {
        output.libraryTarget = 'commonjs2'
        output.path = path.join(distDir, 'server');
        plugins.push(new CleanWebpackPlugin())
        // plugins.push(new PagesManifestPlugin())
        plugins.push(new CopyPlugin({
            patterns: [
                {from: path.join(__dirname, '../server/pages'), to: output.path}
            ]
        }))
        plugins.push(new ReactLoadablePlugin({
            filename: path.resolve(output.path, 'react-loadable.json'),
        }));
        plugins.push(new webpack.DefinePlugin({
            __IS_SERVER__: JSON.stringify(true)
        }))
    } else {
        output.path = distDir;
        plugins.push(new CleanWebpackPlugin())
        plugins.push(new webpack.DefinePlugin({
            __IS_SERVER__: JSON.stringify(false)
        }))
        plugins.push(new ReactLoadablePlugin({
            filename: path.resolve(output.path, 'react-loadable.json'),
        }));
        // optimization.splitChunks = {
        //     maxAsyncRequests: 1,
        //     cacheGroups: {
        //         vendor: {
        //             name: "vendor",
        //             priority: 10,
        //             enforce: true,
        //         },
        //     }
        // };
        // optimization.runtimeChunk = {
        //     name: 'manifest'
        // };
    }
    
    return {
        entry: {
            ...entrypoints
        },
        target: target === 'server' ? 'node' : 'web',
        externals: target === 'server' ? [nodeExternals()] : [],
        output: {
            filename: '[name].js',
            publicPath: '/dist/',
            ...output
        },
        resolve: {
            alias: {
                __root: process.cwd(),
                'ha/document': path.resolve(__dirname, '../server/pages/_document')
            },
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        node: {
            __dirname: true
        },
        mode: 'development',
        externals: {
        },
        module: {
            rules: [{
                    test: /\.jsx?$/,
                    exclude: [/node_modules/],
                    use: [
                        // 'thread-loader',
                        {
                            loader: 'babel-loader',
                            options: target === 'server' ? babelServerOpts : babelClientOpts
                        },
                    ]
                }, {
                    test: /\.less/,
                    use: target === 'server' ? [
                        // 'thread-loader',
                        {
                            loader: 'css-loader'
                        }, 
                        // 'postcss-loader',
                        {
                            loader: 'less-loader',
                            // options: {
                                // javascriptEnabled: true
                            // }
                        }
                    ] : [
                        // 'thread-loader',
                        'style-loader', 
                        {
                            loader: 'css-loader'
                        }, 
                        // 'postcss-loader',
                        {
                            loader: 'less-loader',
                            // options: {
                                // javascriptEnabled: true
                            // }
                        }
                    ]
                }, {
                    test: /\.scss/,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                insertAt: {
                                    before: '#__hachi'
                                },
                            }
                        }, 'css-loader', 'postcss-loader',
                        {
                            loader: 'sass-loader'
                        }
                    ]
                }, {
                    test: /\.(png|jpg|gif|ico)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }, {
                    test: /\.(woff|eot|ttf|woff2|svg)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }]
        },
        plugins: [
            ...plugins,
        ],
        optimization,
    }
}