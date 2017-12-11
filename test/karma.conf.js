module.exports = function (config) {
  config.set({
    basePath: '',
    browsers: ['Electron'],
    frameworks: ['jasmine', 'riot'],
    files: [
      'mocks.js',
      '../dist/riot-view-router.js',
      'e2e/helpers/*.js',
      'e2e/spec.*.js'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      '../dist/riot-view-router.js': ['coverage']
    },
    coverageReporter: {
      reporters: [
        {type : 'html', dir : '../coverage/'},
        {type:'lcovonly', dir : '../coverage/'},
        {type:'json', dir : '../coverage/'}
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true
  })
}
