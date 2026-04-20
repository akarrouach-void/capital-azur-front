/**
 * THEME SWITCHER FUNCTIONALITY TEST
 * 
 * Purpose:
 * - Validates dark/light theme switching functionality
 * - Ensures HTML data-theme attribute updates correctly
 * 
 * Test Process:
 * 1. Navigates to homepage and handles overlays
 * 2. For each theme (dark, light): clicks theme switcher button
 * 3. Selects specific theme option from dropdown
 * 4. Validates HTML data-theme attribute matches selected theme
 * 5. Reloads page after each theme to ensure clean UI state
 * 
 * Themes Tested:
 * - Dark theme: data-theme="dark"
 * - Light theme: data-theme="light"

 * 
 * Expected Results:
 * ✅ Success: "🚀 All themes passed: dark, light"
 * ❌ Failure: Shows which themes failed to apply correctly
 * 
 * Prerequisites:
 * - Theme switcher component present with data-testid attributes
 * - HTML data-theme attribute updates on theme change
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "./utils/overlay-handler.js"

// Helper function to click elements safely
async function clickElementSafely(element, elementName) {
	try {
		await element.waitFor({ state: "visible", timeout: 5000 })
		await element.click({ timeout: 2000 })
		return true
	} catch (error) {
		console.log(`❌ Click failed: ${elementName}`)
		return false
	}
}

test("Theme Switcher Functionality", async ({
	page,
}) => {
	await page.goto("/")
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)

	const themes = ["dark", "light"]
	const successfulThemes = []
	const failedThemes = []

	for (const theme of themes) {
		console.log(`🔍 Testing theme: ${theme}`)

		const themeSwitcherButton = page.getByTestId("theme-switcher-button")
		const buttonClicked = await clickElementSafely(
			themeSwitcherButton,
			"theme-switcher-button"
		)

		if (!buttonClicked) {
			failedThemes.push(theme)
			continue
		}

		await page.waitForTimeout(1000)

		const themeOption = page.getByTestId(`theme-switcher-${theme}`)
		const themeClicked = await clickElementSafely(themeOption, `theme-switcher-${theme}`)

		if (!themeClicked) {
			failedThemes.push(theme)
			continue
		}

		await page.waitForTimeout(1500)

		const htmlElement = page.locator("html")
		const dataThemeAttr = await htmlElement.getAttribute("data-theme")

		try {
			expect(dataThemeAttr).toBe(theme)
			console.log(`🎯 Theme verified - data-theme: "${dataThemeAttr}"`)
			successfulThemes.push(theme)
		} catch (error) {
			failedThemes.push(theme)
		}

		{
			await page.reload()
			await page.waitForLoadState("networkidle")
			await page.waitForTimeout(2000)
			await handleOverlays(page)
		}
	}

	if (failedThemes.length === 0) {
		console.log(`🚀 All themes passed: ${successfulThemes.join(", ")}`)
	} else {
		console.log(
			`❌ Failed: ${failedThemes.join(", ")} | ✅ Passed: ${successfulThemes.join(", ")}`
		)
		throw new Error(`Theme tests failed: ${failedThemes.join(", ")}`)
	}
})
