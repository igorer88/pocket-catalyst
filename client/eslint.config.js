import js from '@eslint/js';
import globals from 'globals';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export const eslintBaseRules = {
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'warn',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  'no-trailing-spaces': 'error',
  'key-spacing': [
    'error',
    {
      beforeColon: false,
      afterColon: true,
      mode: 'strict',
    },
  ],
  'keyword-spacing': [
    'error',
    {
      after: true,
      before: true,
    },
  ],
  'space-before-blocks': ['error', 'always'],
};

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-x': reactX,
      'react-dom': reactDom,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...eslintBaseRules,
      ...reactX.configs['recommended-typescript'].rules,
      ...reactDom.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      semi: ['error', 'always'],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins
            ['^node:'],
            // Packages. `react` related packages come first.
            ['^react', '^@?\\w'],
            // HeroUI packages.
            ['^@heroui(/.*|$)'],
            // Internal packages or aliased imports
            ['^~/', '^@/'],
            // Side effect imports.
            ['^\\u0000'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  }
);
