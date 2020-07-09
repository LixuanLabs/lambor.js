const notifier = require('node-notifier')

module.exports = {
    * default(task) {
        yield task.start('build')
    },
    * ha(task) {
        yield task
            .source('packages/ha/**/*.+(js|jsx|ts|tsx)')
            .babel('server')
            .target('dist/ha', {mode: 0o666})
        notify('Compiled files')
    },
    * build(task) {
        
    }
}

function notify(msg) {
    return notifier.notify({
      title: '▲ Ha.js',
      message: msg,
      icon: false,
    })
  }