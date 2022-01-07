const {babelClientOpts, babelServerOpts} = require('./config/babel-config');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
                        // 'style-loader',
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
                            // options: {
                                // javascriptEnabled: true
                            // }
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
                            // options: {
                                // javascriptEnabled: true
                            // }
                        }
                    ]
                }]
            },
            plugins: [
                new MiniCssExtractPlugin()
            ]
        }
    }
}