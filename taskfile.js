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
        yield task.source('packages/boilerplates/**/*').target('dist/boilerplates')
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