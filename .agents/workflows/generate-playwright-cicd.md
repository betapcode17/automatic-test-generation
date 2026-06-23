# Generate Playwright CI/CD Workflow

Use this workflow when you need to generate or improve CI/CD for a Playwright TypeScript automation framework that must run all generated tests in GitHub Actions.

## Role

You are a senior QA Automation Engineer and CI/CD specialist. Analyze the existing project before making changes. Preserve existing test behavior unless a change is required for CI stability, reporting, or broken locators.

## Final Target

Create a GitHub-ready repository where CI can run without a deployed staging website:

- The repository contains the Playwright framework.
- The repository also contains the application under test, for example in `economic-website/`.
- GitHub Actions starts the database, API, and web app locally.
- Playwright runs every generated test under `tests/generated`.
- Allure results and HTML reports are always uploaded as artifacts.
- Allure HTML can be deployed to GitHub Pages when Pages is enabled.
- No smoke/regression/full suite split is used.

## Required Analysis

Before editing files, inspect:

- `package.json`
- `package-lock.json`
- `playwright.config.ts`
- `.github/workflows/playwright.yml`, if it exists
- `.gitignore`
- `README.md`
- `tsconfig.json`
- `tests/generated/`
- `fixtures/`
- `tests/pages/`
- `tests/support/`
- application source folder, for example `economic-website/`

Confirm whether the app under test is already inside the repository. If not, add it to the repository or document that CI cannot start the app locally until the source exists in the repo.

Do not commit:

- `node_modules/`
- `.env`
- `.env.local`
- logs
- Playwright output
- Allure output
- build output such as `dist/` or `.next/`

## Dependencies

Install missing Playwright reporting dependencies when needed:

```bash
npm install --save-dev allure-playwright allure-commandline
```

Keep `package-lock.json` updated. Do not commit `node_modules`.

## Playwright Configuration

Update `playwright.config.ts` with CI-safe defaults while preserving existing project settings:

```ts
export default defineConfig({
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['dot'],
        ['github'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['allure-playwright', { detail: false, outputFolder: 'allure-results', suiteTitle: true }],
      ]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['allure-playwright', { detail: false, outputFolder: 'allure-results', suiteTitle: true }],
      ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 },
    },
    trace: 'on-first-retry',
  },
});
```

Rules:

- CI must always be headless.
- Keep headed/debug/UI scripts for local debugging only.
- Avoid hardcoded waits and CI-only timeout hacks inside tests.
- Prefer web-first assertions and locator waits over `waitForTimeout`.
- Use `BASE_URL` and `API_URL` instead of hardcoded app URLs inside tests/helpers.

## Allure Reporting

Configure Allure so the report is useful for human and AI debugging:

- Use `detail: false` to reduce low-level Playwright action noise.
- Add readable English test steps.
- Use parent and child steps for meaningful business flows.
- Include locator values and parameter values in step details.
- Attach screenshots for failures.
- Attach retained videos for failures.
- Attach a final screenshot for passed page tests when the project requires evidence for passed cases.
- Keep low-value intermediate automation steps out of the main Test Body.

Use helper utilities, fixtures, or page objects to keep step names consistent.

## Test Execution Strategy

The CI goal is simple:

```text
Run every generated Playwright test under tests/generated.
```

Do not create smoke, regression, or full-suite branching logic for this workflow.

Recommended scripts:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ci": "playwright test",
    "test:generated": "playwright test tests/generated",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:allure": "npm run allure:clean && playwright test",
    "test:allure:generated": "npm run allure:clean && playwright test tests/generated",
    "test:allure:ci": "npm run allure:clean && playwright test && npm run allure:generate",
    "allure:clean": "node -e \"const fs=require('fs'); const opts={recursive:true,force:true,maxRetries:5,retryDelay:500}; for (const dir of ['allure-results','allure-report']) fs.rmSync(dir,opts);\"",
    "allure:generate": "allure generate allure-results -o allure-report --clean",
    "allure:open": "allure open allure-report",
    "allure:serve": "allure serve allure-results",
    "report:allure": "npm run allure:generate",
    "report:html": "playwright show-report",
    "install:browsers": "playwright install",
    "install:browsers:ci": "playwright install --with-deps",
    "clean": "node -e \"const fs=require('fs'); const opts={recursive:true,force:true,maxRetries:5,retryDelay:500}; for (const dir of ['test-results','playwright-report','blob-report','allure-results','allure-report']) fs.rmSync(dir,opts);\"",
    "typecheck": "tsc --noEmit"
  }
}
```

Notes:

- Use retry options in clean scripts because Windows can temporarily lock report files.
- If the root `tsconfig.json` starts typechecking the bundled app and fails because app dependencies live in a nested workspace, scope root typecheck to the Playwright framework only.

Example:

```json
{
  "include": ["fixtures/**/*.ts", "tests/**/*.ts", "playwright.config.ts"],
  "exclude": ["economic-website/**", "node_modules/**"]
}
```

## GitHub Actions Workflow

Create or update:

```text
.github/workflows/playwright.yml
```

The workflow must:

- Run on `ubuntu-latest`.
- Use Node.js 20 for the project runtime.
- Use current GitHub Actions versions that run on modern action runtimes, for example `actions/checkout@v5`, `actions/setup-node@v5`, `actions/cache@v5`, `actions/upload-artifact@v5`.
- Install test framework dependencies with `npm ci`.
- Install bundled application dependencies with `npm ci` in the app folder.
- Cache npm dependencies through `actions/setup-node`.
- Cache Playwright browser binaries with `actions/cache`.
- Install Playwright browsers and Linux dependencies.
- Start the application database.
- Prepare the database schema and seed data.
- Build and start the API.
- Start the web app.
- Wait for API and web readiness before running tests.
- Run `npm run test:allure:generated`.
- Generate Allure HTML even when tests fail.
- Upload artifacts even when tests fail.
- Deploy Allure HTML to GitHub Pages only when Pages is enabled.

Recommended workflow:

```yaml
name: Playwright CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    tags:
      - 'v*'
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:

concurrency:
  group: playwright-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  pages: write
  id-token: write

env:
  CI: true
  BASE_URL: http://localhost:3000
  API_URL: http://localhost:4000/api
  NEXT_PUBLIC_API_URL: http://localhost:4000/api
  DATABASE_URL: postgresql://ecommerce:ecommerce@localhost:55432/ecommerce?schema=public
  JWT_SECRET: ci-secret
  POSTGRES_USER: ecommerce
  POSTGRES_PASSWORD: ecommerce
  POSTGRES_DB: ecommerce

jobs:
  test:
    name: Run generated Playwright tests
    runs-on: ubuntu-latest
    timeout-minutes: 30
    environment:
      name: github-pages
      url: ${{ steps.deploy-allure-pages.outputs.page_url }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Setup Node.js 20
        uses: actions/setup-node@v5
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: |
            package-lock.json
            economic-website/package-lock.json

      - name: Cache Playwright browser binaries
        id: playwright-cache
        uses: actions/cache@v5
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json', 'economic-website/package-lock.json') }}
          restore-keys: |
            playwright-${{ runner.os }}-

      - name: Install npm dependencies
        run: npm ci

      - name: Install application dependencies
        working-directory: economic-website
        run: npm ci

      - name: Install Playwright browsers and Linux dependencies
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npm run install:browsers:ci

      - name: Install Linux dependencies for cached browsers
        if: steps.playwright-cache.outputs.cache-hit == 'true'
        run: npx playwright install-deps

      - name: Clean previous reports
        run: npm run clean

      - name: TypeScript type check
        run: npm run typecheck

      - name: Start PostgreSQL for application
        working-directory: economic-website
        run: docker compose up -d postgres

      - name: Prepare application database
        working-directory: economic-website
        run: |
          npm --workspace apps/api run prisma:generate
          npx prisma db push --schema apps/api/prisma/schema.prisma
          npm --workspace apps/api run prisma:seed

      - name: Build application API
        working-directory: economic-website
        run: npm --workspace apps/api run build

      - name: Start application API
        working-directory: economic-website
        run: |
          nohup node apps/api/dist/main.js > api-ci.log 2>&1 &
          echo $! > api-ci.pid

      - name: Wait for application API
        run: |
          for i in {1..60}; do
            if curl --silent --fail "$API_URL/products" >/dev/null; then
              echo "Application API is ready."
              exit 0
            fi
            sleep 2
          done
          echo "Application API did not become ready in time."
          cat economic-website/api-ci.log || true
          exit 1

      - name: Start application web
        working-directory: economic-website
        run: |
          nohup npm --workspace apps/web run dev -- -p 3000 > web-ci.log 2>&1 &
          echo $! > web-ci.pid

      - name: Wait for application web
        run: |
          for i in {1..60}; do
            if curl --silent --fail "$BASE_URL/login" >/dev/null; then
              echo "Application web is ready."
              exit 0
            fi
            sleep 2
          done
          echo "Application web did not become ready in time."
          cat economic-website/web-ci.log || true
          exit 1

      - name: Run all generated tests in headless mode
        run: npm run test:allure:generated

      - name: Upload application logs
        if: always()
        uses: actions/upload-artifact@v5
        with:
          name: application-logs-generated
          path: |
            economic-website/api-ci.log
            economic-website/web-ci.log
          if-no-files-found: warn
          retention-days: 7

      - name: Generate Allure HTML report
        if: always()
        run: npm run allure:generate
        continue-on-error: true

      - name: Configure GitHub Pages
        id: configure-pages
        if: always() && github.event_name != 'pull_request' && github.ref == 'refs/heads/main'
        uses: actions/configure-pages@v6
        continue-on-error: true

      - name: Upload Allure report for GitHub Pages
        if: always() && steps.configure-pages.outcome == 'success' && github.event_name != 'pull_request' && github.ref == 'refs/heads/main'
        uses: actions/upload-pages-artifact@v5
        with:
          path: allure-report/

      - name: Deploy Allure report to GitHub Pages
        id: deploy-allure-pages
        if: always() && steps.configure-pages.outcome == 'success' && github.event_name != 'pull_request' && github.ref == 'refs/heads/main'
        uses: actions/deploy-pages@v5

      - name: Upload Allure results
        if: always()
        uses: actions/upload-artifact@v5
        with:
          name: allure-results-generated
          path: allure-results/
          if-no-files-found: warn
          retention-days: 14

      - name: Upload Allure HTML report
        if: always()
        uses: actions/upload-artifact@v5
        with:
          name: allure-report-generated
          path: allure-report/
          if-no-files-found: warn
          retention-days: 14

      - name: Upload Playwright HTML report
        if: always()
        uses: actions/upload-artifact@v5
        with:
          name: playwright-report-generated
          path: playwright-report/
          if-no-files-found: warn
          retention-days: 14

      - name: Upload Playwright test results
        if: always()
        uses: actions/upload-artifact@v5
        with:
          name: playwright-test-results-generated
          path: test-results/
          if-no-files-found: ignore
          retention-days: 7
```

## GitHub Pages Notes

GitHub Pages cannot always be created by `GITHUB_TOKEN`. If the workflow logs show:

```text
Resource not accessible by integration
```

enable Pages manually once:

```text
Repository Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

After Pages is enabled, the Allure report URL should be:

```text
https://<owner>.github.io/<repository>/
```

Do not fail the whole CI run just because Pages is not enabled. Keep Allure artifact upload as the reliable fallback.

## Repository Cleanup

Create or update `.gitignore`:

```gitignore
node_modules/
**/node_modules/

.env
.env.*
!.env.example
!.env.*.example

test-results/
playwright-report/
blob-report/
.playwright/
.playwright-cli/
playwright/.cache/

allure-results/
allure-report/
allure-history/

dist/
build/
.next/
coverage/
out/
apps/api/dist/
apps/web/.next/

*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

*.tsbuildinfo
.DS_Store
Thumbs.db
.idea/
.vscode/
```

Remove generated local files before commit when possible. If a local `.env.local` file cannot be deleted because Windows denies access, verify it is ignored and do not stage it.

## README Requirements

Create or update `README.md` with:

- Project overview.
- Explanation that the app under test is bundled in the repo.
- Prerequisites.
- Installation for the Playwright framework.
- Installation for the bundled app.
- Local app startup instructions.
- Generated test command: `npm run test:generated`.
- Allure generated test command: `npm run test:allure:generated`.
- Allure generation and open commands.
- CI flow.
- GitHub Pages report URL and manual enablement note.
- Artifact policy.
- Local debugging commands.

Mention that CI always runs headless and `--headed` is local-only.

## Verification

Run:

```bash
npm run typecheck
```

If the application and API are available locally, run:

```bash
CI=true npm run test:allure:generated
```

If tests fail, inspect:

- Playwright console output.
- `test-results/**/error-context.md`
- failure screenshots
- retained videos
- traces, when available
- application logs such as `api-ci.log` and `web-ci.log`

## Failure Handling Loop

If any testcase fails:

1. Read the Playwright error output.
2. Open `test-results/**/error-context.md`.
3. Inspect failure screenshots.
4. Inspect video or trace when useful.
5. Identify whether the issue is:
   - missing app service
   - missing database or seed data
   - broken locator
   - slow hydration
   - incorrect expectation
   - real application bug
6. Fix locator/page object/helper code when it is a test issue.
7. Fix CI startup/wait logic when the app is not ready.
8. Rerun the smallest failing test locally when possible.
9. Rerun `npm run test:allure:generated`.
10. Update source code, README, or workflow as needed.

## Git Workflow Notes

Before staging, check for stale Git locks:

```bash
git status --short
```

If Git reports `.git/index.lock` and no Git process is running, remove only that stale lock file and retry.

Never commit generated reports, local env files, dependency folders, or build outputs.

## Final Response Format

Summarize:

- Files created or updated.
- That CI runs all generated tests under `tests/generated`.
- App startup strategy.
- Scripts added or changed.
- Allure artifact and Pages behavior.
- Verification commands and results.
- Any remaining manual setup, especially enabling GitHub Pages once in repository settings.
