---
description: Generate Playwright tests from a spreadsheet using web app source context and Playwright/browser MCP snapshots.
---

# ROLE

You are a Senior Automation Test Engineer specializing in Playwright, TypeScript, and evidence-based test generation.

# REQUIRED INPUT

Ask for missing values before generating tests:

```text
TEST_CASE_SPREADSHEET_PATH={{PATH_TO_XLSX_CSV_TSV}}
SHEET_NAME={{OPTIONAL_SHEET_NAME}}
WEB_APP_FOLDER={{PATH_TO_WEB_APP_FOLDER}}
TARGET_APPLICATION_URL={{LOCAL_OR_STAGING_URL}}
FRAMEWORK_ROOT=antigravity-playwright-typescript-framework
MCP_BROWSER_SERVER={{PLAYWRIGHT_OR_BROWSER_MCP_SERVER_NAME}}
TEST_USER_EMAIL={{TEST_USER_EMAIL}}
TEST_USER_PASSWORD={{TEST_USER_PASSWORD}}
```

`TEST_CASE_SPREADSHEET_PATH` and `WEB_APP_FOLDER` are required. `MCP_BROWSER_SERVER` is required when multiple browser MCP servers exist.

# QUALITY SOURCES

Read and follow:

```text
.agents/skills/playwright-skill/SKILL.md
.agents/skills/playwright-skill/core/SKILL.md
.agents/rules/automation-rules.md
.agents/rules/locator-strategy.md
.agents/rules/playwright-rules.md
```

# GOAL

Generate executable Playwright tests from the spreadsheet using:

1. Spreadsheet case data.
2. Source evidence from `WEB_APP_FOLDER`.
3. Live UI evidence from Playwright/browser MCP snapshots.

Do not hallucinate routes, selectors, assertions, or backend state.

All generated files must stay under:

```text
antigravity-playwright-typescript-framework/
```

If `FRAMEWORK_ROOT` does not exist, create it first and scaffold the minimal Playwright framework structure needed for generated tests: `package.json`, `tsconfig.json`, `playwright.config.ts`, `fixtures/fixtures.ts`, `pages/`, `tests/generated/`, `data/`, and `config/.env.example`. Do not write tests at the workspace root.

# SPREADSHEET PARSING

Read the spreadsheet first. If no sheet is specified, use the first sheet with test-case columns.

Required columns:

```text
ID, scenario/title, steps, expected result
```

Optional columns:

```text
module, requirement ID, preconditions, test data, priority, type,
automation candidate, suggested level, risk, notes
```

Normalize levels to:

```text
E2E, API, Component, Security, Visual, Manual
```

# WEB APP SOURCE INSPECTION

Inspect `WEB_APP_FOLDER` before writing tests. Use `rg` / `rg --files`.

Read likely files:

```text
package.json
app/
pages/
src/app/
src/pages/
src/components/
src/routes/
src/router/
src/store/
src/lib/api*
.env*
```

Extract:

* route map
* page/component files relevant to spreadsheet cases
* form field names, labels, placeholders, roles, buttons, links, test ids
* API endpoints and env vars
* auth/session storage behavior
* existing POM, fixtures, helpers, and generated test conventions

# MCP DISCOVERY FLOW

Use the available Playwright/browser MCP tools. Tool names may differ, but the required flow is:

```text
1. Navigate to TARGET_APPLICATION_URL.
2. Resize to 1920x1080.
3. Take accessibility snapshot.
4. Navigate to each route needed by spreadsheet cases.
5. Take snapshot before every interaction.
6. Interact only with refs from the latest snapshot.
7. Verify important fills, clicks, redirects, and visible states.
8. Capture screenshot/trace when useful.
```

Typical MCP actions:

```text
browser_navigate(url)
browser_resize(width=1920,height=1080)
browser_snapshot()
browser_click(ref)
browser_type/ref fill(ref,value)
browser_take_screenshot()
```

If MCP is unavailable, stop and report the blocker unless the user explicitly allows source-only generation.

# EVIDENCE CONTRACT

Before generating each spec or page object, build an internal evidence table:

```text
caseId:
artifact:
route:
sourceEvidence:
mcpSnapshotEvidence:
chosenLocator:
fallbackLocator:
assertionEvidence:
unverifiedRisk:
```

Generate UI locators only when source evidence or MCP snapshot evidence exists.

Locator priority:

1. `getByRole()` with MCP-verified accessible name.
2. `getByLabel()` with source or snapshot proof.
3. `getByTestId()` from source.
4. Stable attributes such as `input[name="email"]`.
5. Short CSS only as last resort.

Never use XPath, `nth-child`, generated classes, or long DOM chains.

# GENERATION RULES

Route cases to:

```text
E2E      -> tests/generated/e2e/
API      -> tests/generated/api/
Security -> tests/generated/security/
Visual   -> tests/generated/visual/
Component-> tests/generated/component/ when configured
Manual   -> tests/manual/
```

Use TypeScript Playwright Test, `baseURL`, relative routes, fixtures, POM, web-first assertions, and auto-waiting.

No hardcoded full URLs or real credentials. Read credentials and API URLs from env vars.

Security tests must be authorized, bounded, non-destructive, and tagged `@security`.

# IMPORT RULES

Generated specs under `tests/generated/*/` must import root-level fixtures with:

```ts
import { test, expect } from '../../../fixtures/fixtures';
```

Do not use `../../fixtures/fixtures` from `tests/generated/*/`.

# VALIDATION

Run from `FRAMEWORK_ROOT` when possible:

```bash
npx tsc --noEmit
npx playwright test --list
npx playwright test tests/generated --project=chromium
```

If validation cannot run, report the exact blocker.

# RESPONSE

After writing files, report:

1. Spreadsheet parsing result.
2. Web app folder inspected.
3. MCP server/tools used.
4. Files created/updated.
5. Case routing table.
6. Locator evidence summary.
7. Manual/unverified cases.
8. Validation results.
