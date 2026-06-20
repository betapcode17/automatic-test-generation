---
trigger: always_on
---

# Playwright-Specific Rules

> These rules apply when developing, debugging, and executing automation tests using Playwright (TypeScript).

---

# 1. Browser Setup (Mandatory)

## Debug Viewport

All UI debugging activities must use the following desktop viewport:

```typescript
{
  width: 1920,
  height: 1080
}
```

This viewport is mandatory during:

* Locator inspection
* UI validation
* Test debugging
* Test generation

---

## Playwright MCP — Mandatory Resize

When using Playwright MCP for UI inspection or debugging, you must always resize the browser immediately after opening the page.

### Required Sequence

```text
1. browser_navigate(url)
2. browser_resize(width=1920, height=1080)
3. browser_snapshot()
   OR
   browser_take_screenshot()
4. Start inspection
```

This sequence is mandatory and must never be skipped.

---

## Headed Mode

During development and debugging:

* Browser must run in headed mode.
* UI must be visible to verify:

  * Locators
  * Rendering
  * User flows
  * Dynamic content

---

## Headless Mode

Headless execution is allowed only when:

* Tests have already passed successfully in headed mode.
* Running inside CI/CD pipelines.
* Running scheduled regression suites.

---

# 2. Element Discovery Workflow

## Preferred Workflow

Use Playwright MCP whenever available to:

* Open the application.
* Navigate through real user flows.
* Inspect the actual DOM.
* Verify element existence before writing automation code.

---

## Strictly Prohibited

Do not:

* Guess locators.
* Copy locators from old automation code without verification.
* Create selectors based only on documentation.
* Assume an element exists because it is mentioned in requirements.
* Build locators without validating them in the real browser.

All locators must be verified against the actual UI.

---

# 3. Playwright Locator Priority

Playwright provides user-centric semantic locators.

Always follow this priority order:

| Priority | Locator              |
| -------- | -------------------- |
| 1        | `getByRole()`        |
| 2        | `getByLabel()`       |
| 3        | `getByPlaceholder()` |
| 4        | `getByText()`        |
| 5        | `getByTestId()`      |
| 6        | `locator('css')`     |

---

## Recommended Examples

### Role-Based

```typescript
page.getByRole('button', { name: 'Login' });

page.getByRole('link', { name: 'Forgot Password' });

page.getByRole('heading', { name: 'Dashboard' });
```

### Label-Based

```typescript
page.getByLabel('Email');

page.getByLabel('Password');
```

### Placeholder-Based

```typescript
page.getByPlaceholder('Enter email');

page.getByPlaceholder('Enter password');
```

### Text-Based

```typescript
page.getByText('Login successful');
```

### Test ID-Based

```typescript
page.getByTestId('login-button');
```

---

## Avoid

```typescript
page.locator('//button[@class="btn-login"]');

page.locator('.form-input:nth-child(2)');

page.locator('#root > div > div > form > button');
```

These selectors are fragile and difficult to maintain.

---

# 4. Waiting Strategy

## Strictly Prohibited

Never use:

```typescript
page.waitForTimeout(5000);
```

```typescript
await new Promise(resolve => setTimeout(resolve, 5000));
```

```typescript
setTimeout(...)
```

Any hard-coded sleep or fixed delay is forbidden.

---

## Preferred Waiting Mechanisms

Use Playwright's built-in auto-waiting behavior.

### Web-First Assertions

```typescript
await expect(locator).toBeVisible();

await expect(locator).toBeEnabled();

await expect(locator).toContainText('Success');

await expect(locator).toHaveText('Success');

await expect(page).toHaveURL(/dashboard/);
```

---

## waitForSelector Usage

Use `waitForSelector()` only when:

* A web-first assertion cannot satisfy the requirement.
* There is a special synchronization scenario.

Example:

```typescript
await page.waitForSelector('[data-testid="loading-complete"]');
```

Otherwise, prefer:

```typescript
await expect(
  page.getByTestId('loading-complete')
).toBeVisible();
```

---

# 5. Test Structure

Every Playwright test should follow the Arrange → Act → Assert pattern.

```typescript
test.describe('Login Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC_LOGIN_001 Successful login', async ({ page }) => {
    // Arrange

    // Act

    // Assert
  });
});
```

---

## Required Structure

### Group Tests by Module

```typescript
test.describe('Authentication', () => {});
test.describe('User Management', () => {});
test.describe('Orders', () => {});
```

---

### Shared Setup

Use:

```typescript
test.beforeEach(async ({ page }) => {});
```

for:

* Login
* Navigation
* Environment setup

---

### Shared Cleanup

Use:

```typescript
test.afterEach(async ({ page }) => {});
```

for:

* Cleanup
* Logout
* Test data removal

---

# 6. Assertions

Every test must contain at least one meaningful assertion.

Prefer assertions that validate business outcomes rather than UI visibility only.

Good examples:

```typescript
await expect(page).toHaveURL('/dashboard');

await expect(
  page.getByText('Customer created successfully')
).toBeVisible();

await expect(
  page.getByRole('row')
).toContainText(customerName);
```

Avoid:

```typescript
await expect(page.locator('body')).toBeVisible();
```

unless visibility itself is the actual expected behavior.

---

# 7. Navigation Rules

Always use route-based navigation.

Correct:

```typescript
await page.goto('/login');

await page.goto('/customers');

await page.goto('/dashboard');
```

Do not hardcode environments:

```typescript
await page.goto('http://localhost:3000/login');

await page.goto('https://staging.company.com/login');
```

Use `baseURL` from `playwright.config.ts`.

---

# 8. Test Isolation

Every test must be executable independently.

Requirements:

* No dependency between tests.
* No shared mutable state.
* No execution-order assumptions.
* Parallel-safe execution.

Each test should:

* Create its own data.
* Clean up its own data if required.
* Be runnable individually.

---

# 9. Playwright Code Quality Checklist

Before delivering generated Playwright code, verify:

* No XPath selectors.
* No fragile CSS selectors.
* No hardcoded URLs.
* No `waitForTimeout()`.
* No custom sleep logic.
* Uses `page.goto('/route')`.
* Uses semantic locators whenever possible.
* Uses web-first assertions.
* Tests are independent.
* Assertions validate business outcomes.
* Repeated logic is extracted into helpers, fixtures, or page objects.
* Code is executable using:

```bash
npx playwright test
```

without manual fixes.
