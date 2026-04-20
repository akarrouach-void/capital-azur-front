/**
 * SEARCH OVERLAY - FUNCTIONALITY VALIDATION TEST
 *
 * Purpose:
 * - Validates search overlay functionality from homepage to search results
 * - Tests search input interaction and form submission
 * - Ensures search query is properly transferred from overlay to results page
 * - Verifies URL contains correct search parameters
 *
 * Test Process:
 * 1. Navigate to homepage "/" and handle overlays
 * 2. Click on desktop search input to open search overlay
 * 3. Wait for search overlay to appear
 * 4. Find search input within overlay
 * 5. Type search query "new" in the input
 * 6. Press Enter in the search field to submit
 * 7. Wait for search results page to load
 * 8. Validate search input on results page contains "new"
 * 9. Verify URL contains query parameter q=new
 *
 * Test Elements:
 * ✅ desktop-search-input - Button to open search overlay
 * ✅ search-autocomplete-overlay - Search overlay container
 * ✅ search-input-autocomplete - Input field within overlay
 * ✅ search-button-autocomplete - Submit button (optional; test uses Enter to submit)
 * ✅ search-input-page-results - Input field on results page
 *
 * Expected Results:
 * ✅ Success: Search overlay opens, accepts input, submits correctly, and results page displays correct query
 * ❌ Failure: Any step in the search flow fails or data is not transferred correctly
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "./utils/overlay-handler.js"
import { testPagination } from "./utils/pagination-tester.js"

test("Search Overlay - Full Search Flow Validation", async ({ page }) => {
	test.setTimeout(60000)

	// Step 1: Navigate to homepage and handle overlays
	console.log("🏠 Navigating to homepage...")
	await page.goto("/")
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)
	
	console.log("✅ Homepage loaded and overlays handled")

	// Step 2: Click on desktop search input to open overlay
	console.log("🔍 Clicking desktop search input...")
	const desktopSearchButton = page.locator('[data-testid="desktop-search-input"]').first()
	await expect(desktopSearchButton).toBeVisible({ timeout: 5000 })
	await desktopSearchButton.click()
	
	console.log("✅ Desktop search input clicked")

	// Step 3: Wait for search overlay to appear
	console.log("⏳ Waiting for search overlay to open...")
	const searchOverlay = page.locator('[data-testid="search-autocomplete-overlay"]')
	await expect(searchOverlay).toBeVisible({ timeout: 5000 })
	
	console.log("✅ Search overlay opened successfully")

	// Step 4: Find search input within overlay
	console.log("🔍 Finding search input within overlay...")
	const searchInput = searchOverlay.locator('[data-testid="search-input-autocomplete"]')
	await expect(searchInput).toBeVisible({ timeout: 3000 })
	
	console.log("✅ Search input found in overlay")

	// Step 5: Type search query "new" in the input
	// Character-by-character input keeps Headless UI Combobox + React state in sync;
	// fill() alone can leave the controlled input out of sync with submit handling.
	console.log("⌨️ Typing 'new' in search input...")
	await searchInput.click()
	await searchInput.pressSequentially("new", { delay: 30 })

	// Verify the input contains our text
	await expect(searchInput).toHaveValue("new")
	
	// Wait for onChange event to propagate to parent component
	await page.waitForTimeout(500)
	console.log("✅ Search query 'new' entered successfully")

	// Step 6: Submit with Enter (same path as the overlay’s onKeyDown handler)
	console.log("📤 Pressing Enter to search...")
	const urlBeforeSubmit = page.url()
	console.log(`📍 URL before submit: ${urlBeforeSubmit}`)

	await searchInput.press("Enter")

	console.log("✅ Enter pressed — search submitted")

	// Step 7: Wait for navigation to search results page
	console.log("⏳ Waiting for navigation to search results page...")
	
	// Wait for URL to change from the current page
	try {
		await page.waitForFunction(
			(initialUrl) => window.location.href !== initialUrl,
			urlBeforeSubmit,
			{ timeout: 10000 }
		)
		console.log("✅ URL changed detected")
	} catch (timeoutError) {
		console.log("⚠️ URL did not change within 10s, checking current state...")
	}
	
	// Wait for page to fully load
	await page.waitForLoadState("networkidle", { timeout: 10000 })
	await page.waitForTimeout(2000) // Additional wait for page to fully render
	
	// Verify we're on the search results page
	const currentUrl = page.url()
	console.log(`📍 Current URL after submit: ${currentUrl}`)
	
	// Check if we're on search results page
	if (currentUrl.includes("/search")) {
		console.log(`✅ Search results page loaded: ${currentUrl}`)
	} else {
		console.log(`❌ Expected to be on search results page, but current URL is: ${currentUrl}`)
		console.log("🔍 Checking if search overlay is still visible...")
		
		// Check if search overlay is still open (form submission might have failed)
		const overlayStillVisible = await searchOverlay.isVisible().catch(() => false)
		if (overlayStillVisible) {
			console.log("⚠️ Search overlay is still visible - form submission may have failed")
			throw new Error(`Form submission failed - still on homepage: ${currentUrl}`)
		} else {
			console.log("⚠️ Search overlay closed but not on search results page")
			throw new Error(`Navigation failed - expected /search but got: ${currentUrl}`)
		}
	}

	// Step 8: Validate search input on results page contains "new"
	console.log("🔍 Validating search input on results page...")
	const resultsPageInput = page.locator('[data-testid="search-input-page-results"]')
	await expect(resultsPageInput).toBeVisible({ timeout: 5000 })
	await expect(resultsPageInput).toHaveValue("new")
	
	console.log("✅ Search input on results page contains 'new'")

	// Step 9: Verify URL contains query parameter q=new
	console.log("🔗 Validating URL query parameter...")
	const urlObj = new URL(currentUrl)
	const searchQuery = urlObj.searchParams.get("q")
	expect(searchQuery).toBe("new")
	
	console.log(`✅ URL contains correct query parameter: q=${searchQuery}`)

	// ==========================================
	// 📄 PAGINATION TESTING (using dynamic utility)
	// ==========================================
	// Build pagination configuration specific to search results listing
	const paginationConfig = {
		containerTestId: "search-results-pagination-container",
		previousTestId: "search-results-pagination-previous", 
		nextTestId: "search-results-pagination-next",
		pagerTestId: "search-results-pagination-pager",
		pageButtonPattern: "search-results-pagination-",
	}
	const paginationResult = await testPagination(page, paginationConfig)

	// Final success message
	console.log("\n🎉 SEARCH OVERLAY FUNCTIONALITY TEST COMPLETED SUCCESSFULLY!")
	console.log("✅ All steps validated:")
	console.log("   - Homepage navigation ✅")
	console.log("   - Search overlay opening ✅")
	console.log("   - Search input interaction ✅")
	console.log("   - Form submission ✅")
	console.log("   - Results page loading ✅")
	console.log("   - Query preservation ✅")
	console.log("   - URL validation ✅")
	console.log(`   - Pagination testing ${paginationResult.tested ? "✅" : "N/A"}`)
})
