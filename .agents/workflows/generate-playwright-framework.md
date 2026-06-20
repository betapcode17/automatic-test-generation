---
description: 
---

# ROLE

You are a Senior Test Automation Architect specializing in the Node.js ecosystem and Playwright. You have extensive experience designing scalable, maintainable, high-performance End-to-End (E2E) automation frameworks optimized for modern CI/CD pipelines.

# CONTEXT

I need to build or update a Playwright-based Web UI Automation Framework inside the existing project root.

Project root:

```text
antigravity-playwright-typescript-framework/
```

Do not create a new framework folder such as `playwright-framework`, `playwright-e2e-framework`, or another sibling directory. All generated or updated framework files must be placed under `antigravity-playwright-typescript-framework/` unless the user explicitly provides a different project root.

The framework must:

* Be written in TypeScript with strict mode enabled.
* Follow Playwright best practices.
* Support scalability and maintainability.
* Be optimized for parallel execution and CI/CD.
* Follow Page Object Model (POM).
* Support multiple environments (dev, staging, production).
* Support data-driven testing and reusable fixtures.
* Use modern Playwright locator strategies.

Core technologies:

* Playwright Test
* TypeScript
* Node.js
* dotenv
* GitHub Actions

Target application:

`{{TARGET_APPLICATION_URL}}`

Use this value only as input context. Generated code must read `BASE_URL` from environment variables and navigate with relative routes such as `page.goto('/login')`.

Credentials:

Email: `{{TEST_USER_EMAIL}}`

Password: `{{TEST_USER_PASSWORD}}`

Credential values must be loaded from environment variables or CI secrets. Do not hardcode real usernames, emails, or passwords in generated source code, test data, documentation, or workflow files.

# TASK

Design and generate a complete Playwright Automation Framework boilerplate inside `antigravity-playwright-typescript-framework/`.

This is an implementation workflow, not an advisory workflow. The agent must create or update real files in the workspace. Do not only describe the framework, do not only return a directory tree, and do not only provide code snippets.

The framework must include:

1. Directory Structure

   * Modern and scalable folder architecture.
   * Rooted at `antigravity-playwright-typescript-framework/`.
   * Clear separation of:

     * configuration
     * page objects
     * fixtures
     * test data
     * utilities
     * tests
     * reports

2. Page Object Model

   * BasePage abstraction layer.
   * Reusable wrapper methods.
   * LoginPage implementation.

3. Configuration Management

   * playwright.config.ts
   * Browser projects:

     * Chromium
     * Firefox
     * WebKit
   * Timeouts
   * Retries
   * Workers
   * Reporters

4. Environment Management

   * dotenv integration
   * .env.dev
   * .env.staging
   * .env.prod

5. Data-Driven Testing

   * JSON-based test data
   * Parameterized Playwright tests

6. Playwright Fixtures

   * Custom fixtures
   * Automatic Page Object injection
   * Shared setup and teardown

7. Dependencies

   * package.json
   * NPM scripts
   * Required libraries

# CONSTRAINTS

* Use TypeScript only.
* Enable strict TypeScript mode.
* Use @playwright/test.
* Follow Page Object Model.
* Do not place locators directly in test files.
* Prefer:

  * getByRole()
  * getByLabel()
  * getByTestId()
* Avoid:

  * XPath
  * fragile CSS selectors
  * page.waitForTimeout()
* Use Playwright auto-waiting.
* Use Playwright Fixtures instead of repeatedly instantiating Page Objects.
* Generate production-ready code.
* Follow Clean Code principles.
* Add concise comments where necessary.
* Read credentials from `.env` files for local runs and GitHub Actions secrets for CI runs.
* Do not commit generated `.env` files containing real credential values; provide only safe `.env.example` placeholders.
* Do not create files outside `antigravity-playwright-typescript-framework/` unless explicitly requested.

# LOCAL VALIDATION

After creating or updating files, run validation from `antigravity-playwright-typescript-framework/` when dependencies are available:

* `npm install` or `npm ci` only when dependencies are missing and the user allows dependency installation.
* `npx tsc --noEmit` when `tsconfig.json` exists.
* `npx playwright test --list` when Playwright is installed.
* A targeted smoke spec with `npx playwright test <spec-path> --project=chromium` only when the app server, credentials, and browser are available.

If a validation command cannot be run, report the concrete blocker instead of silently skipping it.

# OUTPUT FORMAT

After creating or updating the actual files, provide the response in the following sections:

1. Directory Structure

   * Actual tree of created/updated files
   * Purpose of each folder
   * Paths must start with `antigravity-playwright-typescript-framework/`

2. Files Created Or Updated

   * File path
   * Action: created, updated, or left unchanged
   * Short purpose

3. Setup & Dependencies

   * package.json
   * Installation commands that were run, or commands that still need to be run with a reason

4. Core Configurations

   * playwright.config.ts
   * dotenv setup
   * Safe `.env.example` files only

5. Page Object Model

   * BasePage.ts
   * LoginPage.ts

6. Custom Fixtures

   * fixtures.ts

7. Test Data & Implementation

   * Safe test data with placeholder credentials only
   * login.spec.ts
   * Data-driven test examples

8. CI/CD Integration

   * GitHub Actions workflow
   * Reporting configuration

9. Validation Report

   * Commands run from `antigravity-playwright-typescript-framework/`
   * Result of each command
   * Any command not run and why

10. How To Run

   * UI mode
   * Headed mode
   * Parallel execution
   * Report generation
