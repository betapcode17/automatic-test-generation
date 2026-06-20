---
trigger: always_on
---

# General Rules for QA Automation

> These rules apply to all automation testing activities regardless of framework (Playwright, Selenium, Cypress, Appium, etc.).

---

# 1. Architecture & Framework

* Page Object Model (POM) is mandatory.
* Clearly separate responsibilities:

  * **Page Classes**: Define locators and UI interaction methods.
  * **Test Classes**: Contain test logic and assertions.
  * **Test Data**: Stored separately from functional code (JSON, Fixtures, Utilities, Data Providers).
* Assertions must only exist in Test Classes.
* Never place assertions inside Page Classes.

---

# 2. Test Data Generation

* Any field requiring uniqueness (Email, Username, Customer ID, Employee Code, etc.) must be generated dynamically.
* Use UUIDs, timestamps, Faker libraries, or equivalent generators.
* Generated data must be traceable so test-created records can be easily identified in the database.

### Naming Format

```text
[prefix]_[testName]_[timestamp]_[random]
```

### Example

```text
auto_createCustomer_20260402_A3F2@test.com
```

* Test data must support parallel execution.
* Each test case must generate and use its own unique dataset.
* Avoid shared test data that may create conflicts between concurrent executions.

---

# 3. Code Quality

* Avoid duplicated logic.
* Create reusable helper methods, utilities, fixtures, or reusable actions for repeated workflows.
* Code must be:

  * Readable
  * Maintainable
  * Simple
  * Self-explanatory

### Before Delivering Code

Remove all:

* Debug statements:

  * `console.log`
  * `print`
  * similar debugging outputs

* Commented-out code:

  ```typescript
  // old code
  ```

  ```typescript
  /* old code */
  ```

* Unused:

  * Locators
  * Variables
  * Methods
  * Imports

---

# 4. File & Folder Management

* Never delete source files without explicit user confirmation.
* Always inspect the existing project structure before creating new files.
* Avoid creating duplicate files or duplicate implementations.
* Place files in the correct project folders according to the project architecture documentation.

Reference:

```text
plan/automation/0_project_architecture
```

---

# 5. Naming Conventions

## TypeScript / Playwright

| Component        | Rule                             | Example                                 |
| ---------------- | -------------------------------- | --------------------------------------- |
| Page Class       | PascalCase + `Page` suffix       | `LoginPage.ts`                          |
| Test File        | kebab-case + `.spec.ts`          | `login.spec.ts`                         |
| Test Block       | Behavior-driven description      | `test('successful login')`              |
| Locator Variable | lowerCamelCase or readonly field | `readonly loginButton`                  |
| Utilities        | PascalCase or kebab-case         | `DataGenerator.ts`, `data-generator.ts` |

---

# 6. Assertions

* Every test case must contain at least one assertion.
* Prefer assertions at key business checkpoints throughout the workflow.
* Assertions must validate actual expected behavior, not implementation details.

### Playwright Example

```typescript
await expect(
  page.getByText('Login successful')
).toBeVisible();
```

### Assertion Guidelines

* Verify business outcomes.
* Use meaningful assertion messages where supported.
* Prefer web-first assertions.
* Avoid assertions on unstable UI attributes unless required.

---

# 7. Test Independence

* Every test case must be fully independent.
* No test should rely on the execution result of another test.
* Setup and cleanup must be clearly defined.

### Playwright Example

```typescript
test.beforeEach(async ({ page }) => {});

test.afterEach(async ({ page }) => {});
```

### Additional Rules

* Do not share mutable state across tests.

* Do not depend on execution order.

* Tests must support:

  * Parallel execution
  * Isolated execution
  * Retry execution

* A test should be executable independently and produce the same result regardless of whether the full suite is executed.

---

# 8. Playwright Best Practices

* Always use `page.goto('/route')`.
* Never hardcode environments such as:

  * `http://localhost:3000`
  * `https://staging.example.com`
* Use `baseURL` from `playwright.config.ts`.

### Preferred Locators

1. `getByRole()`
2. `getByLabel()`
3. `getByTestId()`

Avoid:

* XPath
* Fragile CSS selectors
* Dynamic class names

### Waiting Strategy

Use:

```typescript
await expect(locator).toBeVisible();
await expect(locator).toContainText('Success');
```

Never use:

```typescript
page.waitForTimeout(5000);
```

### Navigation

Use:

```typescript
await page.waitForURL('/dashboard');
```

Only when explicit navigation validation is required.

### Test Tags

Use:

```typescript
test('@smoke TC_LOGIN_001 Login successfully', async () => {});
```

```typescript
test('@regression TC_LOGIN_002 Login with invalid password', async () => {});
```

* `@smoke` for critical happy paths.
* `@regression` for validation, negative, security, boundary, and edge cases.

---

# 9. AI-Generated Test Rules

When generating Playwright tests from requirements, test cases, or Excel files:

* Only automate test cases marked as automation candidates.

* Do not invent selectors, routes, credentials, or business rules.

* Missing information must be listed under:

  * Assumptions
  * Risks
  * Manual Verification Required

* Generate maintainable code:

  * Reusable helpers
  * Reusable page objects
  * Shared fixtures when appropriate

* Generated tests must be executable with:

```bash
npx playwright test
```

without requiring manual code fixes.
