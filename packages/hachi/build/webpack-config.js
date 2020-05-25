const { ReactLoadablePlugin } = require('react-loadable/webpack');
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
    const outputPath = path.join(distDir, target === 'server' ? 'server' : '')
    return {
        entry: {
            ...entrypoints
        },
        output: {
            path: outputPath,
            filename: 'js/[name].js',
            publicPath: '/dist/'
        },
        resolve: {
            alias: getAlias(),
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        externals: {
        },
        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: [/node_modules\/(?!(react-dnd|dnd-core|react-dnd-html5-backend))/],
                    use: [
                        'thread-loader',
                        {
                            loader: 'babel-loader',
                            options: babelCnf
                        },
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
            target === 'server' &&
                new ReactLoadablePlugin({
                    filename: REACT_LOADABLE_MANIFEST,
                }),
        ],
        optimization: {
            splitChunks: {
                maxAsyncRequests: 1,
                cacheGroups: {
                    vendor: {
                        test: /node_modules(?!(\/(@ant-design|antd)))/,
                        chunks: "all",
                        name: "vendor",
                        priority: 10,
                        enforce: true,
                    },
                    ant: {
                        test: /node_modules\/(@ant-design|antd)/,
                        chunks: "all",
                        name: "ant",
                        priority: 12,
                        enforce: true
                    }
                }
            },
            runtimeChunk: {
                name: 'manifest'
            }
        },
    }
}