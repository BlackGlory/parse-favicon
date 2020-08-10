const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.base.json')

module.exports = {
  preset: 'ts-jest'
, testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)']
, moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  })
}
