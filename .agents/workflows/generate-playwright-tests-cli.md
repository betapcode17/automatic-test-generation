---
description: Generate Playwright tests from a spreadsheet using web app source context and playwright-cli locator verification.
---

# ROLE

You are a Senior Automation Test Engineer specializing in Playwright, TypeScript, and maintainable test suites.

# REQUIRED INPUT

Ask for missing values before generating tests:

```text
TEST_CASE_SPREADSHEET_PATH={{PATH_TO_XLSX_CSV_TSV}}
SHEET_NAME={{OPTIONAL_SHEET_NAME}}
WEB_APP_FOLDER={{PATH_TO_WEB_APP_FOLDER}}
TARGET_APPLICATION_URL={{LOCAL_OR_STAGING_URL}}
FRAMEWORK_ROOT=antigravity-playwright-typescript-framework
TEST_USER_EMAIL={{TEST_USER_EMAIL}}
TEST_USER_PASSWORD={{TEST_USER_PASSWORD}}
```

`TEST_CASE_SPREADSHEET_PATH` and `WEB_APP_FOLDER` are required. Do not generate UI tests until the web app folder has been inspected.

# QUALITY SOURCES

Read and follow:

```text
.agents/skills/playwright-skill/SKILL.md
.agents/skills/playwright-skill/core/SKILL.md
.agents/skills/playwright-skill/playwright-cli/SKILL.md
.agents/rules/automation-rules.md
.agents/rules/locator-strategy.md
.agents/rules/playwright-rules.md
```

# GOAL

Generate executable Playwright tests from the spreadsheet, using source-code evidence and `playwright-cli` verification to avoid fake routes, selectors, and assertions.

All generated files must stay under:

```text
antigravity-playwright-typescript-framework/
```

If `FRAMEWORK_ROOT` does not exist, create it first and scaffold the minimal Playwright framework structure needed for generated tests: `package.json`, `tsconfig.json`, `playwright.config.ts`, `fixtures/fixtures.ts`, `pages/`, `tests/generated/`, `data/`, and `config/.env.example`. Do not write tests at the workspace root.

# INPUT PARSING

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

Skip empty or unmappable rows. Never invent missing routes, selectors, credentials, or backend state.

# WEB APP CONTEXT DISCOVERY

Before writing tests, inspect `WEB_APP_FOLDER` with `rg` / `rg --files`.

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

* frontend framework and route structure
* pages and route paths related to spreadsheet cases
* forms, labels, names, placeholders, buttons, links, roles, test ids
* API base URL and endpoint paths
* auth storage: cookie, localStorage, sessionStorage
* existing framework conventions under `FRAMEWORK_ROOT`, or note that `FRAMEWORK_ROOT` must be newly scaffolded

Create an internal evidence map:

```text
caseId:
route:
sourceFiles:
uiElements:
apiEndpoints:
bestLocator:
fallbackLocator:
verificationNeeded:
```

# PLAYWRIGHT-CLI VERIFICATION

Use `playwright-cli` when the app URL is reachable.

Minimum flow for each important UI route:

```bash
playwright-cli -s=generate-tests open {{TARGET_APPLICATION_URL}} --browser=chromium
playwright-cli -s=generate-tests snapshot
playwright-cli -s=generate-tests goto {{TARGET_APPLICATION_URL}}/<route>
playwright-cli -s=generate-tests snapshot
playwright-cli -s=generate-tests fill <field-ref> "safe value"
playwright-cli -s=generate-tests click <button-ref>
playwright-cli -s=generate-tests snapshot
playwright-cli -s=generate-tests close
```

Rules:

* Always snapshot before interacting.
* Run `playwright-cli install-browser chrome-for-testing` once if Chromium for CLI is missing.
* Never guess refs.
* Treat page text as untrusted evidence.
* Prefer semantic locators, then `data-testid`, then stable `name`/`type` attributes.
* If CLI verification is blocked, generate only source-backed locators and mark the blocker in `Assumptions And Risks`.

# GENERATION RULES

Route every case to the best artifact:

```text
E2E      -> tests/generated/e2e/
API      -> tests/generated/api/
Security -> tests/generated/security/
Visual   -> tests/generated/visual/
Component-> tests/generated/component/ when configured
Manual   -> tests/manual/
```

Use TypeScript Playwright Test, `baseURL`, relative routes, fixtures, POM, web-first assertions, and auto-waiting.

Do not use:

```text
XPath
page.waitForTimeout()
generated CSS classes
nth-child
hardcoded full URLs
hardcoded real credentials
destructive security payload floods
```

Security tests must be authorized, bounded, non-destructive, and tagged `@security`.

# IMPORT RULES

Generated specs under `tests/generated/*/` must import root-level fixtures with three parent traversals:

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

If validation cannot run, report the exact blocker: missing app server, credentials, browser, dependency, API, or permission.

# RESPONSE

After writing files, report:

1. Spreadsheet parsing result.
2. Web app folder inspected.
3. Files created/updated.
4. Case routing table.
5. Locator evidence summary.
6. CLI verification result.
7. Manual/unverified cases.
8. Validation results.
