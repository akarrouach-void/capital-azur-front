/**
 * LANGUAGE SWITCHING AND LOCALIZATION TEST
 * 
 * Purpose:
 * - Validates multi-language functionality and proper locale switching
 * - Ensures HTML lang and dir attributes are correctly set for each language
 * - Verifies all language pages load successfully (200 status)
 * 
 * Test Process:
 * 1. Fetches enabled languages from project.config.js and the default system language from Admin Console
 * 2. Navigates to system language URL and validates HTML attributes
 * 3. For each other language: clicks language switcher button, selects language
 * 4. Validates page loads successfully (200 status) and HTML attributes updated
 * 5. Handles overlays that might block UI interactions
 * 
 * Languages Supported:
 * - LTR languages: "en", "fr" (dir="ltr")  
 * - RTL languages: "ar" (dir="rtl")
 * - Configured in project.config.js and Admin Console
 * 
 * Expected Results:
 * ✅ Success: "🚀 All languages passed: fr, ar, en"
 * ❌ Failure: Shows which languages failed validation or page load
 * 
 * Prerequisites:
 * - Languages enabled in project.config.js (languages.enabled array)
 * - Default system language configured in Admin Console (system__language)
 * - Language switcher UI present with proper data-testid attributes
 */

import { test, expect } from "@playwright/test"
import projectConfig from "../project.config.js"
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

test("Language Configuration and Switch Locale", async ({ page, request }) => {
	// Get languages and system language from config/API
	const enabledLanguages = projectConfig.languages.enabled
	const response = await request.get("/api/admin/flags?method=getAllPublicRawFlags")
	expect(response.ok()).toBeTruthy()

	const flags = await response.json()
	const systemLanguage = flags.find((f) => f.name === "system__language")?.value

	if (!systemLanguage) {
		throw new Error("❌ System language not found in Admin Console response")
	}

	console.log(
		`🌐 Testing languages: ${enabledLanguages.join(", ")} | System: ${systemLanguage}`
	)

	// Navigate to system language and prepare for testing
	const pageResponse = await page.goto(`/${systemLanguage}`)
	// Check if the page is working 200
	expect(pageResponse.status()).toBe(200)
	console.log(
		`✅ Page loaded successfully: /${systemLanguage} (${pageResponse.status()})`
	)

	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)

	// Check initial HTML attributes
	let htmlElement = page.locator("html")
	let langAttr = await htmlElement.getAttribute("lang")
	let dirAttr = await htmlElement.getAttribute("dir")

	const successfulLanguages = []
	const failedLanguages = []

	// Verify system language
	try {
		console.log(`🔍 Testing default language: ${systemLanguage}`)
		expect(langAttr).toBe(systemLanguage)
		const expectedDir = systemLanguage === "ar" ? "rtl" : "ltr"
		expect(dirAttr).toBe(expectedDir)
		console.log(`🎯 Language verified - lang: "${langAttr}", dir: "${dirAttr}"`)
		successfulLanguages.push(systemLanguage)
	} catch (error) {
		failedLanguages.push(systemLanguage)
	}

	// Test language switching for other languages
	const otherLanguages = enabledLanguages.filter((lang) => lang !== systemLanguage)

	if (otherLanguages.length === 0) {
		if (failedLanguages.length > 0) {
			throw new Error(`System language test failed: ${failedLanguages.join(", ")}`)
		}
		return
	}

	for (const language of otherLanguages) {
		console.log(`🔍 Testing language: ${language}`)
		// Click switch locale button
		const switchLocaleButton = page.getByTestId("switch-locale-button")
		const buttonClicked = await clickElementSafely(
			switchLocaleButton,
			"switch-locale-button"
		)

		if (!buttonClicked) {
			failedLanguages.push(language)
			continue
		}

		await page.waitForTimeout(1500)

		// Click language item
		const languageItem = page.getByTestId(`switch-locale-item-${language}`)

		// Wait for navigation response after clicking language item
		const [navigationResponse] = await Promise.all([
			page.waitForResponse((response) => response.url().includes(`/${language}`)),
			clickElementSafely(languageItem, `switch-locale-item-${language}`),
		])

		if (!navigationResponse) {
			failedLanguages.push(language)
			continue
		}

		// Check if the page loaded successfully
		expect(navigationResponse.status()).toBe(200)
		console.log(`✅ Language page loaded: /${language} (${navigationResponse.status()})`)

		// Wait for page navigation and check attributes
		await page.waitForLoadState("networkidle")
		await handleOverlays(page)

		htmlElement = page.locator("html")
		langAttr = await htmlElement.getAttribute("lang")
		dirAttr = await htmlElement.getAttribute("dir")

		try {
			expect(langAttr).toBe(language)
			const expectedDir = language === "ar" ? "rtl" : "ltr"
			expect(dirAttr).toBe(expectedDir)
			console.log(`🎯 Language verified - lang: "${langAttr}", dir: "${dirAttr}"`)
			successfulLanguages.push(language)
		} catch (error) {
			console.log(`❌ Language verification failed: ${language}`)
			failedLanguages.push(language)
		}
	}

	// Final results
	if (failedLanguages.length === 0) {
		console.log(`🚀 All languages passed: ${successfulLanguages.join(", ")}`)
	} else {
		console.log(
			`❌ Failed: ${failedLanguages.join(", ")} | ✅ Passed: ${successfulLanguages.join(
				", "
			)}`
		)
		throw new Error(`Language tests failed: ${failedLanguages.join(", ")}`)
	}
})
