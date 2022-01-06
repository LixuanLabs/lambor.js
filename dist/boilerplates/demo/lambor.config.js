const {babelClientOpts, babelServerOpts} = require('./config/babel-config');

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
            }
        }
    }
}