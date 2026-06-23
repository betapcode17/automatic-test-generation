---
description: Generate Playwright tests from a spreadsheet using only a live website and Playwright/browser MCP snapshots.
---

# ROLE

You are a Senior Automation Test Engineer specializing in Playwright, TypeScript, accessibility-first locators, and evidence-based test generation from live browser behavior.

# REQUIRED INPUT

Ask for missing values before generating tests:

```text
TEST_CASE_SPREADSHEET_PATH={{PATH_TO_XLSX_CSV_TSV}}
SHEET_NAME={{OPTIONAL_SHEET_NAME}}
TARGET_APPLICATION_URL={{LOCAL_OR_STAGING_URL}}
FRAMEWORK_ROOT=antigravity-playwright-typescript-framework
MCP_BROWSER_SERVER={{PLAYWRIGHT_OR_BROWSER_MCP_SERVER_NAME}}
TEST_USER_EMAIL={{TEST_USER_EMAIL}}
TEST_USER_PASSWORD={{TEST_USER_PASSWORD}}
API_URL={{OPTIONAL_API_BASE_URL}}
```

Required values:

- `TEST_CASE_SPREADSHEET_PATH`
- `TARGET_APPLICATION_URL`
- `FRAMEWORK_ROOT`
- `MCP_BROWSER_SERVER` when multiple browser MCP servers exist

`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, and `API_URL` are required only when the spreadsheet cases need authenticated UI/API flows.

Do not require `WEB_APP_FOLDER`. This workflow intentionally does not inspect application source code. The website itself is the source of UI evidence.

# QUALITY SOURCES

Read and follow when available:

```text
.agents/skills/playwright-skill/SKILL.md
.agents/skills/playwright-skill/core/SKILL.md
.agents/rules/automation-rules.md
.agents/rules/locator-strategy.md
.agents/rules/playwright-rules.md
```

# GOAL

Generate executable Playwright tests from spreadsheet cases using:

1. Spreadsheet case data.
2. Live UI evidence from Playwright/browser MCP snapshots.
3. Optional API observations only when the case explicitly requires API validation and `API_URL` is available.

Do not read or analyze the web application's source project. Do not hallucinate routes, selectors, assertions, backend state, or hidden implementation details.

All generated files must stay under:

```text
antigravity-playwright-typescript-framework/
```

If `FRAMEWORK_ROOT` does not exist, create it first and scaffold the minimal Playwright framework structure needed for generated tests:

```text
package.json
tsconfig.json
playwright.config.ts
fixtures/fixtures.ts
tests/generated/
tests/pages/
tests/support/
tests/manual/
config/.env.example
```

Do not write tests at the workspace root.

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

Create a test case inventory immediately after parsing. Every non-empty spreadsheet row must end in exactly one bucket:

```text
generated, manual, blocked
```

Do not silently drop any case ID.

# NO SOURCE INSPECTION RULE

Do not inspect the application source folder to discover routes, selectors, components, stores, API clients, or environment variables.

Allowed project inspection is limited to the Playwright framework only:

```text
package.json
playwright.config.ts
tsconfig.json
fixtures/
tests/pages/
tests/support/
tests/generated/
tests/manual/
```

Do not read app folders such as:

```text
WEB_APP_FOLDER
src/app
src/pages
src/components
app/
pages/
routes/
store/
lib/api*
```

Use MCP browser interaction to discover the application from the outside, just like a real user.

# MCP DISCOVERY FLOW

Use the available Playwright/browser MCP tools. Tool names may differ, but the required flow is:

```text
1. Navigate to TARGET_APPLICATION_URL.
2. Resize to 1920x1080.
3. Take an accessibility snapshot.
4. Identify visible navigation, links, forms, buttons, headings, tables, and key user flows.
5. Navigate to each route needed by spreadsheet cases using visible links or direct routes from spreadsheet steps.
6. Take a fresh snapshot before every interaction.
7. Interact only with refs from the latest snapshot.
8. Verify important fills, clicks, redirects, validation messages, and visible states.
9. Capture screenshots when useful for evidence.
10. Save auth state if login is needed for multiple cases.
```

Typical MCP actions:

```text
browser_navigate(url)
browser_resize(width=1920,height=1080)
browser_snapshot()
browser_click(ref)
browser_type(ref,value) or browser_fill(ref,value)
browser_press(key)
browser_take_screenshot()
browser_wait_for()
```

If MCP is unavailable, stop and report the blocker. Do not fall back to source-only generation.

# MCP EVIDENCE CONTRACT

Before generating each spec or page object, build an internal evidence table:

```text
caseId:
artifact:
route:
spreadsheetStep:
mcpSnapshotEvidence:
observedUserAction:
observedResult:
chosenLocator:
fallbackLocator:
assertionEvidence:
unverifiedRisk:
```

Generate UI locators only when MCP snapshot evidence exists.

Locator priority:

1. `getByRole()` with MCP-verified accessible name.
2. `getByLabel()` with MCP-verified label.
3. `getByPlaceholder()` when the placeholder is visible in MCP evidence.
4. Stable semantic attributes discovered from the live DOM only when MCP tooling exposes them.
5. Short CSS only as a last resort when no accessible locator exists.

Never use:

- XPath
- `nth-child`
- generated classes
- long DOM chains
- source-only selectors
- guessed labels or buttons

# ROUTE AND STATE DISCOVERY

Routes must come from one of these sources:

- Spreadsheet steps.
- Current browser URL after user navigation.
- Visible links/buttons discovered by MCP snapshot.
- Redirect URLs observed after live interactions.

Authentication state must be discovered by live login behavior, not source inspection.

If credentials are required:

1. Navigate to the login page discovered by MCP or spreadsheet steps.
2. Fill credentials from env/test data.
3. Submit using a MCP-verified control.
4. Verify the post-login visible state.
5. Save storage state if the framework supports it.

# GENERATION RULES

Route cases to:

```text
E2E      -> tests/generated/e2e/
API      -> tests/generated/api/ only when API_URL and endpoint behavior are known from the case or observed network behavior
Security -> tests/generated/security/
Visual   -> tests/generated/visual/
Component-> tests/generated/component/ only when the framework is configured for component tests
Manual   -> tests/manual/
```

Coverage rules:

- Every parsed case ID must appear in exactly one generated spec, manual checklist, or blocked-case report.
- If a case is not automatable from live MCP evidence, create/update `tests/manual/manual-cases.md`.
- If a case cannot be generated because route, locator, credential, or state evidence is missing, create/update `tests/manual/blocked-cases.md`.
- Generate/update `tests/generated/coverage-map.json` containing every parsed case ID and final artifact path.
- Do not mark the workflow complete while any parsed case ID is absent from the coverage map.

Use TypeScript Playwright Test, `baseURL`, relative routes, fixtures, POM, web-first assertions, and auto-waiting.

No hardcoded full URLs or real credentials. Read credentials and API URLs from env vars.

Security tests must be authorized, bounded, non-destructive, and tagged `@security`.

# PAGE OBJECT RULES

Create or update page objects only from MCP-observed behavior.

Page object methods should represent clear user actions:

```text
openLoginPage
fillEmail
fillPassword
submitLogin
expectLoginFormVisible
expectProfileVisible
```

Each method should use Allure/custom step helpers when available and include:

- clear English step name
- locator detail
- parameter value detail when safe

Avoid exposing passwords directly in step text. Use masked values for secrets.

# IMPORT RULES

Generated specs under `tests/generated/*/` must import root-level fixtures with:

```ts
import { test, expect } from '../../../fixtures/fixtures';
```

Do not use `../../fixtures/fixtures` from `tests/generated/*/`.

# VALIDATION

Validation is mandatory after writing generated code. Do not finish immediately after creating files.

Run from `FRAMEWORK_ROOT`:

```bash
npm run typecheck
npx playwright test --list
npx playwright test tests/generated --project=chromium
```

Use this ladder:

1. Run `npm run lint` if the script exists.
2. Run `npm run typecheck` if the script exists; otherwise run `npx tsc --noEmit` when `tsconfig.json` exists.
3. Run `npx playwright test --list` when Playwright is installed.
4. Run targeted generated specs with Chromium when app/browser/credentials are available.

Validation rules:

- TypeScript/import/module/syntax/test-discovery errors are generated-code failures and must be fixed.
- Coverage validation is required: parsed spreadsheet IDs must match `tests/generated/coverage-map.json`.
- If any parsed case ID is missing from generated/manual/blocked artifacts, generate the missing artifact and rerun validation.
- If validation fails because of generated code, update the files and rerun the failed command.
- Repeat fix-and-rerun until validation passes or only an environment blocker remains.
- Do not mark the workflow complete while `npx playwright test --list` fails.
- If a command cannot run, report the exact blocker and command.

# FAILURE HANDLING LOOP

If a generated testcase fails:

1. Read the Playwright error output.
2. Open `test-results/**/error-context.md`.
3. Inspect screenshot/video/trace when available.
4. Re-open the target page with MCP.
5. Take a fresh snapshot.
6. Compare the failing locator/assertion with current live UI evidence.
7. Fix the generated locator, page object, or assertion when the test is wrong.
8. Mark the case blocked/manual when live evidence is insufficient or the app state cannot be reached.
9. Rerun the smallest failing test.
10. Rerun `npx playwright test tests/generated --project=chromium` when practical.

# RESPONSE

After writing files, report:

1. Spreadsheet parsing result.
2. Target URL explored with MCP.
3. MCP server/tools used.
4. Files created/updated.
5. Case routing table.
6. Locator evidence summary from MCP snapshots.
7. Manual/unverified/blocked cases.
8. Coverage summary: parsed count, generated count, manual count, blocked count, missing count.
9. Validation results, fixes applied, and remaining blockers.

Explicitly state that application source code was not inspected.
