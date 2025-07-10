import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        // Google Apps Script globals
        SpreadsheetApp: 'readonly',
        Logger: 'readonly',
        PropertiesService: 'readonly',
        UrlFetchApp: 'readonly',
        Utilities: 'readonly',
        DriveApp: 'readonly',
        DocumentApp: 'readonly',
        GmailApp: 'readonly',
        CalendarApp: 'readonly',
        Maps: 'readonly',
        Charts: 'readonly',
        HtmlService: 'readonly',
        CacheService: 'readonly',
        LockService: 'readonly',
        Session: 'readonly',
        OAuth2: 'readonly',
        JWT: 'readonly',
        CardService: 'readonly',
        BaseService: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'off', // Allow console for Google Apps Script development
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      prettier: prettier,
    },
    rules: {
      ...prettierConfig.rules,
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
  },
  {
    ignores: ['build/', 'node_modules/', '.clasp.json', '*.min.js'],
  },
]
