const notifier = require('node-notifier')

module.exports = {
    * default(task) {
        yield task.start('build')
    },
    * xrd(task) {
        yield task
            .source('packages/xrd/**/*.+(js|jsx|ts|tsx)')
            .babel('server')
            .target('dist/xrd', {mode: 0o666})
        yield task.source('packages/boilerplates/**/*').target('dist/boilerplates')
        notify('Compiled files')
    },
    * build(task) {
        
    }
}

function notify(msg) {
    return notifier.notify({
      title: '▲ xrd.js',
      message: msg,
      icon: false,
    })
  }