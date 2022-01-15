// taskr babel plugin with Babel 7 support
// https://github.com/lukeed/taskr/pull/305
const extname = require('path').extname;
const transform = require('@babel/core').transform


const babelServerOpts = {
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
        loose: true
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
}

module.exports = function (task) {
  task.plugin('babel', {}, function* (
    file,
  ) {
    const babelOpts = babelServerOpts

    const options = {
      ...babelOpts,
      plugins: [
        ...babelOpts.plugins,
      ],
      compact: true,
      babelrc: false,
      configFile: false,
      filename: file.base,
      sourceMaps: true,
    }
    const output = transform(file.data, options)
    const ext = extname(file.base)
    // Replace `.ts|.tsx|.jsx` with `.js` in files with an extension
    if (ext) {
      const extRegex = new RegExp(ext.replace('.', '\\.') + '$', 'i')
      file.base = file.base.replace(extRegex, '.js')
    }
    file.data = Buffer.from(output.code)
  })
}
