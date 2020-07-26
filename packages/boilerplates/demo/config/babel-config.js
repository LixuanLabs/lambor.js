exports.babelClientOpts = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
    ['@babel/preset-react', { useBuiltIns: true }],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    
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
  ],

}