const notifier = require('node-notifier')

module.exports = {
    * default(task) {
        yield task.start('build')
    },
    * hachi(task) {
        yield task
            .source('packages/hachi/**/*.+(js|jsx|ts|tsx)')
            .babel('server')
            .target('dist/hachi', {mode: 0o666})
        notify('Compiled files')
    },
    * build(task) {
        
    }
}

function notify(msg) {
    return notifier.notify({
      title: '▲ Hachi',
      message: msg,
      icon: false,
    })
  }