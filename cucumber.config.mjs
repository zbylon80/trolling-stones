export default {
  default: [
    '--publish-quiet',
    '--format',
    'progress',
    '--import',
    './tests/steps/**/*.ts',
    '--import',
    './tests/support/**/*.ts',
    '--loader',
    'ts-node/esm',
    './tests/features/**/*.feature'
  ]
};
