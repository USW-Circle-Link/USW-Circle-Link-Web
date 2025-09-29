module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(jpg|jpeg|png|svg)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios).+\\.js$'
  ],
}; 
