export default {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testRegex: 'src/.*\\.test\\.tsx?$',
  coveragePathIgnorePatterns: ['/node_modules/', '__tests__'],
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-webview|ramda|react-native-render-html|@react-native|stringify-entities|character-entities-\\w+)/)'
  ],
  setupFiles: ['<rootDir>/jest.setup.ts'],
}