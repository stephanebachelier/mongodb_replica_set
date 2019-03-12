module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    'jest-extended',
    'jest-chain'
  ],
  modulePaths: [
    '<rootDir>',
    'node_modules'
  ]
}
