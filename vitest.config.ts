import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: __dirname,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage/vitest',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.cy.ts',
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/**/stories/**',
        'src/**/types.ts',
        'src/**/types/**',
        'src/**/index.ts',
      ],
    },
  },
})
