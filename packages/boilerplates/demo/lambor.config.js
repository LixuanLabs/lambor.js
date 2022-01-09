const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    webpack: (params) => {
        const {
            target = 'server'
        } = params;
        return {
            module: {
                rules: [{
                    test: /\.less/,
                    use: target === 'server' ? [
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
            ]
        }
    }
}
