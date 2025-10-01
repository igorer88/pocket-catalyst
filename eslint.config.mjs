import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixupPluginRules } from '@eslint/compat'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
import nodePlugin from 'eslint-plugin-node'
import reactDom from 'eslint-plugin-react-dom'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactX from 'eslint-plugin-react-x'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

import {
  eslintBaseRules,
  importSortRules,
  eslintNodeRules,
  typescriptEslintRules
} from './config/linter/index.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __uiFolder = 'web'

const tsFiles = ['{src,tests}/**/*.ts']
const tsxFiles = [`${__uiFolder}/src/**/*.{ts,tsx}`]

const languageOptions = {
  globals: {
    ...globals.node,
    ...globals.jest
  },
  ecmaVersion: 2023,
  sourceType: 'module'
}

const customTypescriptConfig = {
  files: tsFiles,
  plugins: {
    '@typescript-eslint': typescriptEslintPlugin,
    'simple-import-sort': simpleImportSort,
    node: fixupPluginRules(nodePlugin)
  },
  languageOptions: {
    ...languageOptions,
    parser: tsParser,
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname
    }
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: path.resolve(__dirname, 'tsconfig.json')
      },
      node: {
        paths: [path.resolve(__dirname, 'src')],
        extensions: ['.js', '.ts', '.d.ts']
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.d.ts']
    }
  },
  rules: {
    ...eslintBaseRules,
    ...importSortRules,
    ...eslintNodeRules,
    ...typescriptEslintRules
  }
}

const customReactConfig = {
  files: tsxFiles,
  plugins: {
    '@typescript-eslint': typescriptEslintPlugin,
    'simple-import-sort': simpleImportSort,
    'react-x': reactX,
    'react-dom': reactDom,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh
  },
  languageOptions: {
    ...languageOptions,
    globals: {
      ...globals.browser
    },
    parser: tsParser,
    parserOptions: {
      project: [
        `${__uiFolder}/tsconfig.app.json`,
        `${__uiFolder}/tsconfig.node.json`
      ],
      tsconfigRootDir: __dirname
    }
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: path.resolve(__dirname, `${__uiFolder}/tsconfig.app.json`)
      }
    }
  },
  rules: {
    ...eslintBaseRules,
    ...importSortRules,
    ...typescriptEslintRules,
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ]
  }
}

const recommendedTypeScriptConfigs = [
  {
    files: tsFiles,
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
      ...typescriptEslintPlugin.configs.stylistic.rules
    }
  }
]

export default [
  {
    ignores: [
      '**/.eslintrc.cjs',
      'docs/*',
      'build/*',
      'lib/*',
      'dist/**',
      'config/scripts',
      'src/metadata.ts',
      '**/node_modules/**',
      '**/coverage/**',
      '*-lock.json',
      '*-lock.yaml',
      '*.lock',
    ]
  },
  ...recommendedTypeScriptConfigs,
  customTypescriptConfig,
  customReactConfig
]
