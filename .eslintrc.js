export default {
    env: {
      browser: true,
      es2021: true
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended'
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: ['react'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  };