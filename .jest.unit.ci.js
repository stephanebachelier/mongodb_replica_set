module.exports = Object.assign({}, require('./.jest.unit'), {
  verbose: false,
  reporters: [
    [
      'jest-junit', {
        output: 'report/unit-results.xml'
      }
    ],
    [
      'jest-silent-reporter', {
        useDots: true
      }
    ]
  ]
})
