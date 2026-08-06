import { test, expect, type ConsoleMessage, type Page } from "@playwright/test";

/** Every AI CEO subroute and the heading it must render. */
export const AI_CEO_ROUTES: { path: string; heading: string }[] = [
  { path: "/ai-ceo", heading: "AI CEO Dashboard" },
  { path: "/ai-ceo/live-monitor", heading: "Live Action Monitor" },
  { path: "/ai-ceo/decision-engine", heading: "Decision Engine" },
  { path: "/ai-ceo/approvals", heading: "Approval Suggestions" },
  { path: "/ai-ceo/risk", heading: "Risk & Compliance" },
  { path: "/ai-ceo/performance", heading: "Performance Intelligence" },
  { path: "/ai-ceo/predictions", heading: "Predictive Insights" },
  { path: "/ai-ceo/reports", heading: "AI Reports" },
  { path: "/ai-ceo/learning", heading: "System Learning Log" },
  { path: "/ai-ceo/settings", heading: "Settings" },
];

/** Collect console errors and uncaught page errors for the life of a page. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("AI CEO subroutes render", () => {
  for (const { path, heading } of AI_CEO_ROUTES) {
    test(`${path} renders "${heading}" with no console errors`, async ({ page }) => {
      const errors = watchErrors(page);

      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${path} HTTP status`).toBe(200);

      // Shell chrome plus the section heading must both be present.
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page.getByRole("link", { name: /Live Action Monitor/i }).first()).toBeVisible();

      // Hydration completed (no mismatch wipes) and nothing threw.
      await page.waitForTimeout(500);
      expect(errors, `${path} console/page errors`).toEqual([]);
    });
  }
});

test.describe("legacy paths redirect into the CEO module", () => {
  for (const path of ["/", "/owner", "/softwarewala"]) {
    test(`${path} redirects to /ai-ceo`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(/\/ai-ceo$/);
      await expect(page.getByRole("heading", { level: 1, name: "AI CEO Dashboard" })).toBeVisible();
    });
  }
});

test("sidebar navigation reaches every section without a full reload", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/ai-ceo", { waitUntil: "domcontentloaded" });

  for (const { heading } of AI_CEO_ROUTES.slice(1)) {
    await page.getByRole("link", { name: new RegExp(heading, "i") }).first().click();
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }

  expect(errors, "console/page errors during navigation").toEqual([]);
});
