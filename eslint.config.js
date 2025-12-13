const nextConfig = require('eslint-config-next');

module.exports = [
  ...nextConfig,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'no-unused-vars': ['error', { args: 'none', vars: 'all', ignoreRestSiblings: true }],
    },
  },
];
