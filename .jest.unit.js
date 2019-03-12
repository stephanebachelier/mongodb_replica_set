module.exports = Object.assign({}, require('./.jest.config'), {
  testRegex: [
    '/test/unit/(.*).test.js$'
  ],
  verbose: true,
  restoreMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'bin/**/*.js',
    'helper/**/*.js',
    'lib/**/*.js'
  ],
  coverageReporters: ['html', 'cobertura']
})
