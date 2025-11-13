import { expect, test } from "@playwright/test";

test.describe("should add data attribute to root html element", () => {
	test.use({ colorScheme: "light" });

	test("in light mode", async ({ page }) => {
		await page.goto("/");

		await expect(page.locator("html")).toHaveAttribute("data-ui-color-scheme", "light");
	});
});

test.describe("should add data attribute to root html element", () => {
	test.use({ colorScheme: "dark" });

	test("in dark mode", async ({ page }) => {
		await page.goto("/");

		await expect(page.locator("html")).toHaveAttribute("data-ui-color-scheme", "dark");
	});
});
