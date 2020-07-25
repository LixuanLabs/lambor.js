const notifier = require('node-notifier')

module.exports = {
    * default(task) {
        yield task.start('build')
    },
    * copy(task) {
        yield task.source('packages/boilerplates/**/*').target('dist/boilerplates', {mode: 0o777})
    },
    * xrdc(task) {
        yield task.parallel([
            'copy',
            'build'
        ])
        notify('Compiled files')
    },
    * build(task) {
        yield task
            .source('packages/xrd/**/*.+(js|jsx|ts|tsx)')
            .babel('server')
            .target('dist/xrd', {mode: 0o777})
    }
}

function notify(msg) {
    return notifier.notify({
      title: '▲ xrd.js',
      message: msg,
      icon: false,
    })
  }