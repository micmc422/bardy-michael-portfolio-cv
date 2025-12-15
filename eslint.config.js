const nextConfig = require('eslint-config-next');

module.exports = [
  ...nextConfig,
  {
    plugins: {
      'unused-imports': require('eslint-plugin-unused-imports'),
    },
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
];
