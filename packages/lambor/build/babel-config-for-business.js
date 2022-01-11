exports.babelClientOpts = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { loose: true }],
    ['@babel/preset-react', { useBuiltIns: true }],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      "file-loader",
      {
          "name": "img/[name].[hash:7].[ext]",
          "extensions": ["png", "jpg", "jpeg", "gif", "ico"],
          "publicPath": "/dist",
          "outputPath": null
      },
      "img-file-loader"
    ],
    [
      "file-loader",
      {
        "name": "font/[name].[hash:7].[ext]",
        "extensions": ["woff", "eot", "ttf", "woff2", "svg"],
        "publicPath": '/dist',
        "outputPath": null
      },
      "font-file-loader"
    ],
    'lambor-utils/babel-loadable-plugin'
  ],
}

exports.babelServerOpts = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-react', { useBuiltIns: true }],
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        targets: {
          node: '8.3',
        },
        loose: true,
      },
    ],
  ],
  plugins: [
    'dynamic-import-node',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      "file-loader",
      {
          "name": "img/[name].[hash:7].[ext]",
          "extensions": ["png", "jpg", "jpeg", "gif", "ico"],
          "publicPath": "/dist",
          "outputPath": null
      },
      "img-file-loader"
    ],
    [
      "file-loader",
      {
        "name": "font/[name].[hash:7].[ext]",
        "extensions": ["woff", "eot", "ttf", "woff2", "svg"],
        "publicPath": '/dist',
        "outputPath": null
      },
      "font-file-loader"
    ],
    'lambor-utils/babel-loadable-plugin'
  ],

}
