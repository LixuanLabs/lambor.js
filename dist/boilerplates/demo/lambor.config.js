const path = require('path');
const {babelClientOpts, babelServerOpts} = require('./config/babel-config');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DIST_DIRECTORY, REACT_LOADABLE_MANIFEST } = require('./config/constants');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
console.log('ReactLoadablePlugin==>', ReactLoadablePlugin);

module.exports = {
    webpack: (params) => {
        const {
            target = 'server'
        } = params;
        return {
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
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        {
                            loader: 'css-loader'
                        }, 
                        'postcss-loader',
                        {
                            loader: 'less-loader',
                        }
                    ] : [
                        // 'thread-loader',
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        {
                            loader: 'css-loader'
                        }, 
                        'postcss-loader',
                        {
                            loader: 'less-loader',
                        }
                    ]
                }]
            },
            plugins: [
                new MiniCssExtractPlugin(),
                new ReactLoadablePlugin({
                    filename: path.resolve(__dirname, DIST_DIRECTORY, REACT_LOADABLE_MANIFEST),
                }),
            ]
        }
    }
}