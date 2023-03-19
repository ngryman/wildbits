import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    screenshotsFolder: 'tests/cypress/screenshots',
    specPattern: '{features,packages}/*/tests/**/*.spec.ts',
    supportFile: 'tests/cypress/support/e2e.ts',
  },
})
