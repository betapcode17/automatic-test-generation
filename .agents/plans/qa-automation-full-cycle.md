# QA Automation Full Cycle Plan

Use this plan to coordinate the full AI-assisted software testing lifecycle, from an Excel specification file to generated Playwright automation and CI/CD.

This plan connects local rules, skills, and workflows into one complete process. It is intentionally framework-aware, MCP-first for UI discovery, and designed to run all generated tests rather than splitting tests into smoke/regression/full suites.

## Purpose

Transform an Excel test specification into a maintainable Playwright TypeScript automation framework with:

- expanded and clarified test cases
- live UI reconnaissance through MCP/browser tools
- Page Object Model design
- traceable dynamic test data
- generated Playwright tests under `tests/generated`
- Allure evidence and artifacts
- GitHub Actions CI/CD that starts the app locally and runs all generated tests

## Primary Inputs

```text
TEST_CASE_SPREADSHEET_PATH={{PATH_TO_XLSX_CSV_TSV}}
SHEET_NAME={{OPTIONAL_SHEET_NAME}}
TARGET_APPLICATION_URL={{LOCAL_OR_STAGING_URL}}
FRAMEWORK_ROOT=antigravity-playwright-typescript-framework
MCP_BROWSER_SERVER={{PLAYWRIGHT_OR_BROWSER_MCP_SERVER_NAME}}
TEST_USER_EMAIL={{OPTIONAL_TEST_USER_EMAIL}}
TEST_USER_PASSWORD={{OPTIONAL_TEST_USER_PASSWORD}}
API_URL={{OPTIONAL_API_BASE_URL}}
```

Do not require the web application source folder for MCP-based test generation. The live website is the source of UI evidence.

## Connected Rules

Always load and obey these rules when present:

```text
.agents/rules/automation-rules.md
.agents/rules/locator-strategy.md
.agents/rules/playwright-rules.md
```

Rule responsibilities:

- `automation-rules.md`: architecture, POM boundaries, dynamic test data, independence, clean code.
- `locator-strategy.md`: locator priority, stability, uniqueness, and prohibited locator patterns.
- `playwright-rules.md`: Playwright-specific assertions, navigation, waits, fixtures, and CI safety.

## Connected Skills

Use these skills depending on the phase:

```text
.agents/skills/playwright-skill/SKILL.md
.agents/skills/playwright-skill/core/SKILL.md
.agents/skills/playwright-skill/pom/SKILL.md
.agents/skills/playwright-skill/ci/SKILL.md
.agents/skills/playwright-cli/SKILL.md
```

Skill responsibilities:

- `playwright-core`: assertions, locators, fixtures, auth, debugging, data, reliability.
- `playwright-pom`: page class design and POM boundaries.
- `playwright-ci`: GitHub Actions, artifacts, Allure, caching, Pages deployment.
- `playwright-cli` or browser MCP: live UI exploration and evidence gathering.

## Connected Workflows

Use these workflows in order:

```text
.agents/workflows/generate-test-cases.md
.agents/workflows/generate-playwright-tests-mcp-server.md
.agents/workflows/review-playwright-tests.md
.agents/workflows/generate-playwright-cicd.md
```

Optional fallback workflows:

```text
.agents/workflows/generate-playwright-framework.md
.agents/workflows/generate-playwright-tests-cli.md
.agents/workflows/generate-playwright-tests.md
```

Use source-inspection workflows only when the user explicitly asks for source-based generation. For MCP-only generation, do not inspect the app source.

## Reordered Execution Flow

### Phase 0: Intake And Scope Confirmation

Goal: confirm the input and expected output before generation starts.

Actions:

1. Receive the Excel/CSV/TSV test specification file.
2. Confirm target URL, framework root, browser/MCP server, credentials, and API URL when needed.
3. Confirm the target framework: Playwright + TypeScript unless the user explicitly says otherwise.
4. Confirm the CI target: GitHub Actions unless the user explicitly says otherwise.
5. Confirm the output rule: all generated tests must live under `tests/generated`.
6. Confirm the CI rule: run all generated tests, not smoke/regression/full suites.

Exit criteria:

- Required inputs are known.
- Missing credentials or URL blockers are documented.
- The AI knows whether generation is MCP-only or source-assisted.

### Phase 1: Context And Role Setup

Goal: establish the AI role, project standards, and technical constraints.

Use:

```text
.rules/automation-rules.md
.rules/locator-strategy.md
.rules/playwright-rules.md
.skills/playwright-skill/SKILL.md
.skills/playwright-skill/core/SKILL.md
```

Actions:

1. Assume the role of Senior QA Automation Engineer.
2. Load the project standards and Playwright best practices.
3. Inspect only the automation framework structure:
   - `package.json`
   - `playwright.config.ts`
   - `fixtures/`
   - `tests/pages/`
   - `tests/support/`
   - `tests/generated/`
4. Do not inspect app source when MCP-only generation is selected.
5. Identify existing conventions for fixtures, page objects, Allure steps, and generated tests.

Exit criteria:

- Framework conventions are known.
- Constraints are clear.
- The AI has not guessed locators or routes.

### Phase 2: Requirement Understanding And Test Case Expansion

Goal: read the Excel specification, understand the business requirement, and expand test coverage before automation.

Use:

```text
.workflows/generate-test-cases.md
.rules/automation-rules.md
```

Actions:

1. Parse the spreadsheet.
2. Identify modules, screens, scenarios, steps, expected results, test data, and priorities.
3. Expand coverage with:
   - positive scenarios
   - negative scenarios
   - validation scenarios
   - boundary cases
   - edge cases
   - permission/security checks
4. Normalize every case into a consistent inventory.
5. Mark each case as one of:
   - generated candidate
   - manual candidate
   - blocked candidate
6. Do not generate automation code yet.

Exit criteria:

- Every non-empty row has a case ID.
- No case is silently dropped.
- Ambiguities and missing information are recorded.

### Phase 3: UI Analysis And MCP Recon

Goal: collect real UI evidence from the running website instead of guessing selectors from text or source code.

Use:

```text
.workflows/generate-playwright-tests-mcp-server.md
.skills/playwright-cli/SKILL.md
.rules/locator-strategy.md
```

Actions:

1. Open `TARGET_APPLICATION_URL` with MCP/browser tools.
2. Resize viewport to desktop size, usually `1920x1080`.
3. Take accessibility snapshots.
4. Navigate through routes required by the spreadsheet cases.
5. Before every interaction, take a fresh snapshot.
6. Interact only with refs from the latest MCP snapshot.
7. Record locator evidence:
   - role
   - accessible name
   - label
   - placeholder
   - visible text
   - stable attribute exposed by the browser when available
8. Verify observed outcomes:
   - redirects
   - validation messages
   - success messages
   - disabled/enabled states
   - stored session behavior when visible/observable
9. Mark cases blocked if UI evidence cannot be obtained.

Exit criteria:

- Each generated candidate has route evidence.
- Each generated candidate has locator evidence.
- Each generated candidate has assertion evidence.
- No app source code was inspected in MCP-only mode.

### Phase 4: POM Design

Goal: design page objects before writing test scripts.

Use:

```text
.skills/playwright-skill/pom/SKILL.md
.rules/automation-rules.md
.rules/locator-strategy.md
```

Actions:

1. Group UI behavior into page classes.
2. Put locators and user actions in page classes.
3. Keep assertions in test files, not in page classes.
4. Name methods by user intent:
   - `openLoginPage`
   - `fillEmail`
   - `fillPassword`
   - `submitLogin`
   - `openProductDetail`
5. Keep page classes small and purposeful.
6. Avoid duplicate page objects or duplicate helper functions.
7. Include Allure/custom step names in clear English when project helpers exist.
8. Include locator and safe parameter details in steps.

Exit criteria:

- POM file list is planned.
- Method names are clear.
- Locators are traceable to MCP evidence.
- Assertions remain in tests.

### Phase 5: Test Data Strategy

Goal: prevent flaky tests caused by reused hardcoded data.

Use:

```text
.rules/automation-rules.md
.skills/playwright-skill/core/test-data-management.md
```

Actions:

1. Identify data fields that require uniqueness:
   - email
   - username
   - customer ID
   - order code
   - product name
   - phone number
2. Generate traceable data using timestamp, random suffix, UUID, or Faker when available.
3. Use a naming pattern:

```text
[prefix]_[caseId]_[timestamp]_[random]
```

4. Keep credentials in environment variables.
5. Avoid shared mutable test data.
6. Ensure each test can run independently and in parallel.
7. Define cleanup only when the app supports safe cleanup.

Exit criteria:

- Required test data is defined.
- Unique data strategy exists for state-changing tests.
- No real secrets are hardcoded.

### Phase 6: Automation Script Generation

Goal: generate executable Playwright TypeScript tests from the expanded cases, MCP evidence, POM design, and data strategy.

Use:

```text
.workflows/generate-playwright-tests-mcp-server.md
.skills/playwright-skill/core/SKILL.md
.rules/playwright-rules.md
```

Actions:

1. Generate or update page objects.
2. Generate tests under:

```text
tests/generated/e2e/
tests/generated/api/
tests/generated/security/
tests/generated/visual/
```

3. Import fixtures correctly from generated specs:

```ts
import { test, expect } from '../../../fixtures/fixtures';
```

4. Use `baseURL` and relative routes.
5. Use MCP-verified locators only.
6. Use web-first assertions.
7. Add readable Allure/custom steps.
8. Generate/update:

```text
tests/generated/coverage-map.json
tests/manual/manual-cases.md
tests/manual/blocked-cases.md
```

9. Ensure every parsed case ID appears in exactly one generated/manual/blocked artifact.

Exit criteria:

- Generated code compiles.
- Generated code follows project conventions.
- Coverage map has no missing parsed IDs.

### Phase 7: Run, Debug, And Self-Heal

Goal: run generated automation and fix generated-code issues until it passes or only real blockers remain.

Use:

```text
.skills/playwright-skill/core/debugging.md
.skills/playwright-skill/core/flaky-tests.md
.workflows/generate-playwright-tests-mcp-server.md
```

Actions:

1. Run typecheck.
2. Run Playwright test discovery.
3. Run generated tests:

```bash
npm run test:allure:generated
```

4. If a test fails:
   - read console output
   - open `test-results/**/error-context.md`
   - inspect screenshot/video/trace
   - reopen the page through MCP
   - take a fresh snapshot
   - compare locator/assertion with live UI
   - fix locator/POM/assertion only when the test is wrong
   - mark blocked/manual when evidence or app state is insufficient
5. Rerun the smallest failing test.
6. Rerun all generated tests when practical.

Exit criteria:

- Typecheck passes.
- Test discovery passes.
- Generated tests pass or documented blockers remain.
- Generated failures are not ignored.

### Phase 8: Review And Refactoring

Goal: clean generated code before merge.

Use:

```text
.workflows/review-playwright-tests.md
.rules/automation-rules.md
.rules/locator-strategy.md
.rules/playwright-rules.md
```

Actions:

1. Review generated tests and page objects.
2. Remove duplicated logic.
3. Remove unused imports, unused locators, commented code, debug logs.
4. Simplify over-engineered page objects.
5. Ensure locators are stable and evidence-based.
6. Ensure assertions validate business outcomes.
7. Ensure generated tests are covered by `coverage-map.json`.
8. Ensure test files remain under `tests/generated`.

Exit criteria:

- Code is maintainable.
- No obvious generated-code smell remains.
- Review verdict is approve or approve with minor changes.

### Phase 9: CI/CD Generation

Goal: make GitHub Actions run the generated automation end to end.

Use:

```text
.workflows/generate-playwright-cicd.md
.skills/playwright-skill/ci/SKILL.md
```

Actions:

1. Ensure repo contains the app under test if CI must start it locally.
2. Install framework and app dependencies in CI.
3. Start database, API, and web app in CI.
4. Wait for API and web readiness.
5. Run all generated tests:

```bash
npm run test:allure:generated
```

6. Generate Allure HTML report.
7. Upload artifacts:
   - Allure results
   - Allure HTML report
   - Playwright HTML report
   - test-results
   - application logs
8. Deploy Allure report to GitHub Pages only when Pages is enabled.
9. Keep Pages artifact upload guarded so CI does not fail just because Pages has not been enabled.

Exit criteria:

- CI runs on `ubuntu-latest`.
- CI uses Node.js 20 for project runtime.
- CI uses modern GitHub actions versions.
- CI runs all generated tests.
- Reports are available as artifacts.
- GitHub Pages behavior is documented.

### Phase 10: Repository Readiness And Delivery

Goal: prepare clean source for GitHub.

Actions:

1. Verify `.gitignore` excludes:
   - `node_modules/`
   - `.env`
   - `.env.local`
   - logs
   - Playwright reports
   - Allure reports
   - build outputs
2. Run:

```bash
npm run typecheck
```

3. Run generated tests when environment is available.
4. Check git status.
5. Remove stale `.git/index.lock` only when no Git process is running.
6. Stage only source/config/docs files.
7. Commit with a clear message.
8. Push to the target branch when requested.

Exit criteria:

- Workspace has no unintended source changes.
- Ignored local files are not staged.
- Final response summarizes files changed, validation, CI behavior, and remaining manual setup.

## Completion Criteria

This plan is complete only when:

- The Excel file has been parsed.
- Test cases have been expanded or normalized.
- UI evidence has been collected through MCP.
- Generated tests exist under `tests/generated`.
- Page objects are evidence-based.
- Test data is traceable and non-conflicting.
- Coverage map has no missing parsed case IDs.
- Typecheck passes.
- Generated tests pass or blockers are documented.
- CI/CD runs all generated tests.
- Allure artifacts are available.
- GitHub Pages deployment is configured or the manual enablement step is documented.

## Output Format

Final response must include:

1. Input summary.
2. Rules, skills, workflows, and plan used.
3. Expanded test-case summary.
4. MCP UI reconnaissance summary.
5. POM design summary.
6. Test data strategy summary.
7. Generated files.
8. Coverage summary.
9. Validation results.
10. CI/CD summary.
11. Manual or blocked items.
12. Git status or commit/push result when applicable.
