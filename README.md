# AI Playwright Testing Workspace

This workspace is used to generate, review, and run Playwright tests with agent workflows. It includes reusable agent rules, Playwright skills, workflow prompts, Playwright CLI support, and a sample application named `economic-website`.

## Project Structure

```text
.
├── .agents/
│   ├── rules/
│   ├── skills/
│   └── workflows/
├── economic-website/
├── .gitignore
└── README.md
```

Local-only folders such as `.playwright/`, `.playwright-cli/`, and `node_modules/` are intentionally ignored and should not be committed.

## `.agents/rules`

| Rule | Description | Use When |
|---|---|---|
| `automation-rules.md` | General automation testing standards: structure, maintainability, test data, validation, and review quality. | Any automation workflow. |
| `locator-strategy.md` | Rules for choosing stable locators and avoiding fragile selectors. | Generating or reviewing Playwright locators. |
| `playwright-rules.md` | Playwright-specific rules: browser snapshot before interaction, no guessed locators, auto-waiting, and web-first assertions. | Generating, debugging, or reviewing Playwright tests. |

## `.agents/skills`

| Skill | Description | Use When |
|---|---|---|
| `playwright-skill/` | A full Playwright knowledge base covering E2E, API, visual, accessibility, security, POM, fixtures, CI/CD, and migration. | Writing, fixing, debugging, or reviewing Playwright tests. |
| `playwright-skill/core/` | Core Playwright guidance for locators, assertions, fixtures, auth, API testing, debugging, and framework patterns. | Choosing the right testing pattern. |
| `playwright-skill/ci/` | CI/CD guidance for GitHub Actions, GitLab, Docker, reports, artifacts, and sharding. | Setting up test execution in pipelines. |
| `playwright-skill/pom/` | Page Object Model guidance and tradeoffs between POM, fixtures, and helpers. | Designing maintainable Playwright frameworks. |
| `playwright-skill/playwright-cli/` | Documentation for terminal-based browser control with `playwright-cli`. | Verifying UI and locators with less token usage than MCP. |
| `playwright-cli/` | Local skill installed by `playwright-cli install --skills=agents`. | Letting the agent call the real `playwright-cli` binary. |

## `.agents/workflows`

| Workflow | Purpose | Main Input |
|---|---|---|
| `generate-test-cases.md` | Generate test cases from requirements, user stories, or specs. | Requirement or feature description. |
| `generate-playwright-framework.md` | Create or update a Playwright TypeScript framework. | Target app URL, credentials placeholders, framework root. |
| `generate-playwright-tests.md` | Generate Playwright tests from a spreadsheet. | `.xlsx`, `.xls`, `.csv`, or `.tsv` test case file. |
| `generate-playwright-tests-cli.md` | Generate Playwright tests from a spreadsheet, inspect the web app source, and verify locators with `playwright-cli`. | Spreadsheet, `WEB_APP_FOLDER`, `TARGET_APPLICATION_URL`. |
| `generate-playwright-tests-mcp-server.md` | Generate Playwright tests from a spreadsheet, inspect the web app source, and verify locators with Playwright/browser MCP snapshots. | Spreadsheet, `WEB_APP_FOLDER`, MCP server. |
| `review-playwright-tests.md` | Review Playwright framework/tests for bugs, flaky risks, bad locators, and missing validation. | Existing test folder or file. |

Recommended workflow selection:

| Need | Use |
|---|---|
| Generate test cases first | `generate-test-cases.md` |
| Create a Playwright framework | `generate-playwright-framework.md` |
| Generate tests quickly from a spreadsheet | `generate-playwright-tests.md` |
| Generate tests with source context and lower token cost | `generate-playwright-tests-cli.md` |
| Generate tests with stronger live-browser evidence | `generate-playwright-tests-mcp-server.md` |
| Review failing or flaky Playwright tests | `review-playwright-tests.md` |

## Install Playwright CLI

Playwright CLI lets an agent open a browser from the terminal, take snapshots, interact with element references, and verify locators before writing code.

### 1. Check Node.js

```bash
node --version
npm --version
```

Install Node.js LTS first if these commands are unavailable.

### 2. Install Playwright CLI

```bash
npm install -g @playwright/cli
```

### 3. Initialize CLI in the workspace

Run this from the workspace root:

```bash
playwright-cli install --skills=agents
```

This may create local folders such as:

```text
.playwright/
.playwright-cli/
.agents/skills/playwright-cli/
```

Only `.agents/skills/playwright-cli/` should be committed if you want to keep the installed skill documentation. `.playwright/` and `.playwright-cli/` are local state and should stay ignored.

### 4. Install the browser used by CLI

```bash
playwright-cli install-browser chrome-for-testing
```

### 5. Verify CLI

```bash
playwright-cli --version
playwright-cli -s=demo open about:blank --browser=chromium
playwright-cli -s=demo snapshot
playwright-cli -s=demo close
```

If `snapshot` returns a page URL and a snapshot block, the CLI is ready.

## Install Playwright MCP for Antigravity

Playwright MCP lets Antigravity or an agent control a browser through MCP tools such as navigation, resize, snapshot, click, typing, and screenshots.

Install or configure this MCP package:

```text
@playwright/mcp
```

Example MCP server configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--browser", "chromium"]
    }
  }
}
```

Restart Antigravity after adding the server.

The agent should then have browser tools similar to:

```text
browser_navigate
browser_resize
browser_snapshot
browser_click
browser_type
browser_take_screenshot
```

Use MCP when the UI is complex, when CLI is unavailable, or when you need stronger live-browser evidence.

## Sample App: `economic-website`

`economic-website/` is a sample e-commerce MVP used for testing.

| Area | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, React Query, Zustand, React Hook Form, Zod |
| Backend | NestJS, Prisma, PostgreSQL, JWT Auth, Swagger |
| Infrastructure | Docker, Docker Compose, Nginx |

Important paths:

| Path | Purpose |
|---|---|
| `economic-website/apps/web/` | Frontend source code. |
| `economic-website/apps/api/` | Backend API source code. |
| `economic-website/docs/` | Architecture, API, database, UI/UX, and deployment docs. |
| `economic-website/document/test_cases_economic_login.xlsx` | Sample login test case spreadsheet. |

Default admin account:

```text
Email: admin@economic.local
Password: Admin123!
```

## Run `economic-website`

From the app root:

```bash
cd economic-website
cp .env.example .env
npm install
npm run db:generate
npm --workspace apps/api run prisma:seed
npm run dev
```

Expected URLs:

```text
Web:     http://localhost:3000
API:     http://localhost:4000/api
Swagger: http://localhost:4000/docs
```

Docker option:

```bash
cd economic-website
cp .env.example .env
docker compose up --build
```

## Generate Playwright Tests From Spreadsheet

CLI workflow example:

```text
Use workflow generate-playwright-tests-cli

TEST_CASE_SPREADSHEET_PATH=<path-to-test-cases.xlsx>
SHEET_NAME=Login
WEB_APP_FOLDER=<path-to-web-app-folder>
TARGET_APPLICATION_URL=http://localhost:3000
FRAMEWORK_ROOT=antigravity-playwright-typescript-framework
TEST_USER_EMAIL=admin@economic.local
TEST_USER_PASSWORD=Admin123!
```

MCP workflow example:

```text
Use workflow generate-playwright-tests-mcp-server

TEST_CASE_SPREADSHEET_PATH=<path-to-test-cases.xlsx>
SHEET_NAME=Login
WEB_APP_FOLDER=<path-to-web-app-folder>
TARGET_APPLICATION_URL=http://localhost:3000
FRAMEWORK_ROOT=antigravity-playwright-typescript-framework
MCP_BROWSER_SERVER=playwright
TEST_USER_EMAIL=admin@economic.local
TEST_USER_PASSWORD=Admin123!
```

If `FRAMEWORK_ROOT` does not exist, the workflow should create it and scaffold the minimal Playwright framework structure before writing tests.

## Run Generated Playwright Tests

From the generated framework root:

```bash
cd antigravity-playwright-typescript-framework
npm install
npm test
```

Common commands:

```bash
npm run test:headed
npm run test:ui
npm run report
npm run clean:reports
npx playwright test --list
```

## Important Conventions

Agents must follow these rules:

```text
- Do not hardcode real credentials in test source.
- Use BASE_URL/env variables instead of full hardcoded URLs.
- Do not use XPath, nth-child, or generated CSS classes.
- Do not use page.waitForTimeout().
- Locators must be backed by source evidence or browser snapshot evidence.
- Generated tests must be written under FRAMEWORK_ROOT.
- Specs under tests/generated/*/ must import root fixtures with ../../../fixtures/fixtures.
```

Correct import from `tests/generated/*/*.spec.ts`:

```ts
import { test, expect } from '../../../fixtures/fixtures';
```

Incorrect:

```ts
import { test, expect } from '../../fixtures/fixtures';
```

## Troubleshooting

| Error | Fix |
|---|---|
| `playwright-cli: command not found` | Run `npm install -g @playwright/cli`. |
| CLI opens but `snapshot` says browser is not open | Run `playwright-cli install-browser chrome-for-testing`, then open with `--browser=chromium`. |
| Corrupted Playwright report or trace zip | Delete `test-results/` and `playwright-report/`, then rerun tests. |
| `Cannot find module '../../fixtures/fixtures'` | Use `../../../fixtures/fixtures` from `tests/generated/*/*.spec.ts`. |
| Locator timeout but element exists | Recheck the current UI with CLI or MCP snapshot and update the POM locator. |
