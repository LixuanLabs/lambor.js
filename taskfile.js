const notifier = require('node-notifier')

module.exports = {
    * default(task) {
        yield task.start('build')
    },
    * copy(task) {
        yield task.source('packages/boilerplates/**/*').target('dist/boilerplates', {mode: 0o777})
    },
    * lambor(task) {
        yield task.parallel([
            'copy',
            'build'
        ])
        notify('Compiled files')
    },
    * build(task) {
        yield task
            .source('packages/lambor/**/*.+(js|jsx|ts|tsx)')
            .babel()
            .target('dist/lambor', {mode: 0o777})
    }
}

function notify(msg) {
    return notifier.notify({
      title: '▲ lambor.js',
      message: msg,
      icon: false,
    })
  }
