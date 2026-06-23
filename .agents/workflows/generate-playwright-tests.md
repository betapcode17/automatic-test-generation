---
description: 
---

# ROLE

You are a Senior Automation Test Engineer specializing in Playwright, TypeScript, E2E testing, and maintainable test architecture.

# GOAL

Generate executable Playwright tests from a spreadsheet that contains reviewed test cases.

This workflow must generate Playwright code only. Requirement analysis and test case design belong to `generate-test-cases.md`.

# QUALITY SOURCES

Follow these local standards:

```text
.agents/skills/playwright-skill/SKILL.md
.agents/skills/playwright-skill/core/SKILL.md
.agents/skills/playwright-skill/playwright-cli/SKILL.md
.agents/rules/automation-rules.md
.agents/rules/locator-strategy.md
.agents/rules/playwright-rules.md
```

Apply the Playwright skill Golden Rules:

- Prefer `getByRole()` over CSS/XPath.
- Never use `page.waitForTimeout()`.
- Use web-first assertions.
- Keep every test isolated.
- Use `baseURL` from Playwright config.
- Use retries/traces from config rather than custom sleeps.
- Prefer fixtures/helpers over global mutable state.
- Mock only external services, not the app under test.

Use the sources above for Playwright quality, locators, assertions, fixtures, security boundaries, and project rules.

# INPUT

Expected input is a spreadsheet file only: `.xlsx`, `.xls`, `.csv`, or `.tsv`.

```text
Test case spreadsheet:
{{TEST_CASE_SPREADSHEET_PATH}}

Sheet:
{{SHEET_NAME}}
```

Spreadsheet rules: read the file first; if no sheet is specified, use the first sheet with test-case columns. Required columns: ID, scenario/title, steps, expected result. Optional: module, requirement ID, preconditions, test data, priority, type, automation candidate, suggested level, risk, notes. Match headers case/space-insensitively, split multiline steps, normalize levels to `E2E/API/Component/Security/Visual/Manual`, skip empty/unmappable rows, and never invent routes/selectors/credentials/backend state.

After parsing, create an inventory of all parsed case IDs. Every non-empty spreadsheet row must end in exactly one bucket: `generated`, `manual`, or `blocked`. Do not silently drop any case ID.

Additional context may be provided:

```text
Application routes:
{{ROUTES}}

Known UI selectors / test ids:
{{KNOWN_SELECTORS}}

Authentication details:
{{AUTH_DETAILS}}

Existing test conventions:
{{PROJECT_RULES}}

Project root:
antigravity-playwright-typescript-framework
```

All generated files must be created under `antigravity-playwright-typescript-framework/`. Do not create generated Playwright test files at the workspace root.

# TASK

Generate a multi-layer Playwright test suite from the spreadsheet.

Route every case to the best artifact: `E2E` browser UI, `API` request tests, `Security` safe bounded security tests, `Visual` responsive/visual checks, `Component` component tests if configured, or `Manual` checklist only when automation is unsafe/unreliable. Do not skip non-E2E cases just because they are not UI tests.

Coverage is mandatory: every parsed case ID must appear in exactly one generated spec, manual checklist, or blocked-case report. Generate/update `tests/generated/coverage-map.json` with every parsed case ID and final artifact path. If a case is not automatable, write it to `tests/manual/manual-cases.md`. If evidence is missing, write it to `tests/manual/blocked-cases.md`. Do not finish with missing case IDs.

# IMPLEMENTATION RULES

## Playwright

Use TypeScript Playwright Test, `baseURL`, relative routes, semantic locators, auto-waiting, and web-first assertions. Do not use XPath, fragile CSS, `page.waitForTimeout()`, hardcoded credentials, or hardcoded full URLs.

## API And Security

Use Playwright `request` for API cases. Put API specs in `tests/generated/api/` and safe security specs in `tests/generated/security/`. Use env vars for API URLs, users, passwords, tokens, and roles. Security tests must be authorized, non-destructive, bounded, and tagged `@security`; do not generate real brute-force loops, credential stuffing, destructive scans, or harmful payload floods.

## Visual And Component

Put visual/responsive specs in `tests/generated/visual/` using viewport coverage or stable screenshot assertions. Put component specs in `tests/generated/component/` only if component testing is configured; otherwise create `tests/manual/component-test-recommendations.md`.

## Test Design

Keep tests independent, order-agnostic, parallel-safe, and focused on real business outcomes. Use helpers/fixtures/POM only when they reduce duplication. Store reusable data in fixtures/constants. Document missing data/routes/selectors in `Assumptions And Risks`.

## Tags

Preserve source test case IDs in titles. Add tags as applicable: `@smoke`, `@regression`, `@api`, `@security`, `@visual`, `@component`.

## File And Naming

Use kebab-case. Treat `antigravity-playwright-typescript-framework/` as root. Write only under:

```text
tests/generated/e2e/
tests/generated/api/
tests/generated/security/
tests/generated/visual/
tests/generated/component/
tests/pages/
tests/fixtures/
tests/manual/
```

Import shared framework files with the correct relative path from the generated spec location. For specs under `tests/generated/e2e/`, `tests/generated/api/`, `tests/generated/security/`, `tests/generated/visual/`, or `tests/generated/component/`, import root-level framework files with three parent traversals, for example:

```ts
import { test, expect } from '../../../fixtures/fixtures';
```

Do not use `../../fixtures/fixtures` from `tests/generated/*/` because it resolves to `tests/fixtures/fixtures`, which does not exist in this framework.

# VALIDATION

Validation is mandatory after writing generated code. Do not finish immediately after creating files.

From `antigravity-playwright-typescript-framework/`, run this validation ladder:

```bash
npm run typecheck
npx playwright test --list
npx playwright test tests/generated --project=chromium
```

If `npm run typecheck` is unavailable, run:

```bash
npx tsc --noEmit
```

If `npm run lint` exists, run it before typecheck.

Validation rules:

* `typecheck` or `npx tsc --noEmit` is required when TypeScript config exists.
* `npx playwright test --list` is required when Playwright is installed.
* Coverage validation is required: parsed spreadsheet IDs must match `tests/generated/coverage-map.json`.
* If any parsed case ID is missing from generated/manual/blocked artifacts, generate the missing artifact and rerun validation.
* Run targeted generated specs when the required app server, browser, API, and credentials are available.
* API/security specs should be executed when the API base URL is available; they do not need a browser.
* If validation fails because of generated code, fix the code and rerun the failed validation command.
* Repeat fix-and-rerun until validation passes or only an environment blocker remains.
* Do not mark the workflow complete while generated code has unresolved TypeScript, import, module resolution, syntax, or Playwright test discovery errors.
* If a command cannot run, report the exact blocker and the command that was skipped.

# RESPONSE

After writing files, report:

1. Input Parsing Report: file, sheet, rows read, rows mapped/skipped.
2. Files Created/Updated: path, action, purpose.
3. Routed Test Cases: ID, route, artifact, reason.
4. Manual Cases: ID, reason, required evidence.
5. Assumptions/Risks: missing selectors/routes/data/setup or inferred values.
6. Coverage Summary: parsed count, generated count, manual count, blocked count, missing count.
7. Validation Report: command, result, fixes applied, remaining blockers.

Final check: no sleeps/XPath/fragile CSS/full URLs/hardcoded credentials; tests are tagged, independent, and all generated code has passed available validation.
