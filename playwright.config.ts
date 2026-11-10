import { defineConfig, devices } from "@playwright/test";

const PORTA = 3123;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    ...devices["iPhone 13"],
    browserName: "chromium",
  },
  webServer: {
    command: `npm run build && npx next start -p ${PORTA}`,
    url: `http://localhost:${PORTA}/app/perfis`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
