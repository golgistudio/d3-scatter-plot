var config        = require('./gulpfile.js/config');
var karmaWebpack  = require('karma-webpack');
var webpackConfig = require('./gulpfile.js/lib/webpack-multi-config');
var path          = require('path');

var testSrc = path.join(config.root.src,  '__tests__/*');
var testCode = path.join(config.root.src,  'js/**/*.js');

var karmaConfig = {
  frameworks: ['mocha', 'sinon-chai'],
  plugins: [
    'karma-mocha',
    'karma-chrome-launcher',
    'karma-sinon-chai',
    'karma-mocha-reporter',
    'karma-coverage',
      'karma-nyan-reporter',
      'karma-webpack',
      'karma-firefox-launcher'
  ],
  files: [testCode, testSrc],
  preprocessors: { testCode: ['coverage'] },
  webpack: webpackConfig('test'),
  singleRun: process.env.TRAVIS_CI === 'true',
  reporters: ['nyan', 'progress', 'coverage'],
  browsers: [(process.env.TRAVIS_CI === 'true'? 'Firefox' : 'Chrome')],
  coverageReporter: {
    type : 'html',
    dir : 'demoApp/quality/coverage'
  }
};

karmaConfig.preprocessors[testSrc] = ['webpack'];

module.exports = function(config) {
  config.set(karmaConfig)
};
