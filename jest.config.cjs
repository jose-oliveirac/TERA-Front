module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(lucide-react)/)'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/tests/env.setup.cjs'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/pages/Login/**/*.tsx',
    'src/pages/EsqueciSenha/**/*.tsx',
    'src/pages/RedefinirSenha/**/*.tsx',
    'src/pages/Dashboard/Clientes.tsx',
    'src/pages/Dashboard/Colaboradores.tsx',
    'src/components/ContactForm.tsx',
    'src/utils/formatters.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};
