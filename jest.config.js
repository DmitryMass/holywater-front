/** @type {import('jest').Config} */
export default {
  // Тестове середовище
  testEnvironment: 'jsdom',

  // Підтримка TypeScript з ES модулями
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  // Кореневі директорії для тестів
  roots: ['<rootDir>/src'],

  // Шаблони для пошуку тестових файлів
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],

  // Трансформація файлів
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
        baseUrl: '.',
        paths: {
          '@/*': ['src/*'],
          '@assets/*': ['src/assets/*'],
          '@components/*': ['src/components/*'],
          '@pages/*': ['src/pages/*'],
          '@utils/*': ['src/utils/*'],
          '@hooks/*': ['src/hooks/*'],
          '@types/*': ['src/types/*'],
          '@services/*': ['src/services/*']
        },
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      },
    }],
  },

  // Модулі, які не потребують трансформації
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],

  // Налаштування модулів
  moduleNameMapper: {
    // Підтримка алісів шляхів
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',

    // Мокування CSS та статичних файлів
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__tests__/__mocks__/fileMock.js',
  },

  // Розширення файлів для резолюції модулів
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Резолюція модулів
  resolver: undefined,
  modulePaths: ['<rootDir>/src'],

  // Setup файли
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],

  // Покриття коду
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/__tests__/**/*',
    '!src/**/__tests__/**/*',
    '!src/**/*.test.*',
    '!src/**/*.spec.*',
    '!src/services/api/axios.ts', // Исключаем из-за import.meta
    '!src/hooks/useApi/useScreenConfigApi.tsx', // Исключаем файл с неправильным расширением
  ],

  // Директорія для звітів покриття
  coverageDirectory: 'coverage',

  // Формати звітів покриття
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Пороги покриття коду
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Очищення моків між тестами
  clearMocks: true,

  // Відновлення моків між тестами
  restoreMocks: true,

  // Таймаут для тестів (в мілісекундах)
  testTimeout: 10000,

  // Ігнорування файлів та директорій
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
  ],



  // Verbose вивід
  verbose: true,

  // Глобальные переменные для поддержки import.meta
  globals: {
    'import.meta': {
      env: {
        VITE_API_URL: 'http://localhost:5001/api'
      }
    }
  },
}; 