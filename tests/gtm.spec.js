/**
 * GOOGLE TAG MANAGER (GTM) TEST
 * 
 * Purpose:
 * - Validates that Google Tag Manager is properly configured and loaded
 * - Ensures GTM script is present in DOM when enabled via Admin Console
 * 
 * Test Process:
 * 1. Fetches flags from Admin Console to check GTM status and ID
 * 2. Navigates to homepage and handles overlays
 * 3. Validates GTM is enabled and has an ID (fails if disabled)
 * 4. Searches DOM for GTM script with the expected ID
 * 
 * Expected Results:
 * ✅ Success: "🚀 GTM script is available in DOM with ID: GTM-XXXXX"
 * ❌ Failure: Lists expected vs actual GTM scripts found in DOM
 * 
 * Prerequisites:
 * - GTM must be enabled in Admin Console (system__enable_gtm = true)
 * - GTM ID must be assigned in Admin Console (system__gtm_id = "GTM-XXXXX")
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "./utils/overlay-handler.js"

test("Validate GTM script presence when enabled", async ({ page, request }) => {
	// 1. Fetch flags
	const response = await request.get("/api/admin/flags?method=getAllPublicRawFlags")
	expect(response.ok()).toBeTruthy()

	const flags = await response.json()

	// 2. Extract GTM enable flag & GTM ID
	const gtmEnabled = flags.find((f) => f.name === "system__enable_gtm")?.value === true
	const gtmId = flags.find((f) => f.name === "system__gtm_id")?.value

	// Log values for debugging
	console.log(`GTM Test Report:
    - Is GTM Enabled: ${gtmEnabled}
    - GTM ID: ${gtmId || "not set"}`)

	// 3. Visit the app
	await page.goto("/")
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)

	// Handle any overlays that might interfere with testing
	await handleOverlays(page)

	// Test should fail if GTM is not enabled
	if (!gtmEnabled) {
		throw new Error("❌ GTM is disabled - this test expects GTM to be enabled from Admin console")
	}

	if (!gtmId) {
		throw new Error("❌ GTM enabled but no GTM ID found in API response from Admin console")
	}

	// Wait for page to load completely
	await page.waitForLoadState("networkidle")

	// Check for GTM script in DOM
	const gtmScript = page.locator(
		`script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`
	)

	try {
		await expect(gtmScript).toHaveCount(1, { timeout: 10000 })
		console.log(`🚀 GTM script is available in DOM with ID: ${gtmId}`)
	} catch (error) {
		// If script not found, check what GTM scripts are actually in the DOM
		const allGtmScripts = await page.locator('script[src*="googletagmanager.com"]').all()
		const scriptSources = await Promise.all(
			allGtmScripts.map(async (script) => await script.getAttribute('src'))
		)

		const errorMessage = `❌ Expected GTM script not found in DOM:
  Expected: script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]
  Found ${scriptSources.length} GTM script(s) in DOM:
  ${scriptSources.length === 0 
    ? '  - No GTM scripts found'
    : scriptSources.map(src => `  - ${src}`).join('\n')
  }
  
  Check your GTM configuration in Admin console.`

		throw new Error(errorMessage)
	}
})
