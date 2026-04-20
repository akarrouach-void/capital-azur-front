/**
 * ACADEMY LISTINGS - DYNAMIC PRETTY PATH RULES VALIDATION TEST
 *
 * Purpose:
 * - Validates AcademyListWidget URL generation against comprehensive Pretty Path Rules
 * - Tests ALL combinations of available theme filter options dynamically
 * - Ensures no invalid URL patterns are generated across any filter combination
 * - Verifies reset functionality returns to clean base URL state
 *
 * Test Process:
 * 1. Navigates to /academy page and handles overlays automatically
 * 2. Dynamically discovers all available theme filter options
 * 3. Calculates dynamic timeout based on number of combinations to test
 * 4. Tests every theme combination
 * 5. Validates Pretty Path Rules for each individual combination
 * 6. Tests pagination controls if present (hrefs and click behavior)
 * 7. Tests reset functionality once to ensure clean URL restoration
 * 8. Performs global validation across all generated URLs
 *
 * Pretty Path Rules Validated:
 * ✅ Taxonomy = specific value → show `/digital` in path (not `/all`)
 * ✅ Taxonomy = "all" → omit from path completely (no `/all` segment)
 *
 * 📄 PAGINATION RULES (if pagination exists):
 * ✅ Page = 1 → omit `?page=1` (default, not shown)
 * ✅ Page > 1 → show `?page=X` only when X > 1
 * ✅ Previous button → href="#." on first page, href with page=X-1 otherwise
 * ✅ Next button → href="#." on last page, href with page=X+1 otherwise
 * ✅ Page buttons → hrefs match expected page URLs
 * ✅ Click behavior → resulting URLs match button hrefs
 * ✅ Parameter preservation → ALL query params and taxonomy segments automatically preserved
 *
 * Invalid Patterns Blocked:
 * ❌ `/all` - Single taxonomy "all" must not appear in path
 * ❌ `?page=1` - Default page parameter must be omitted
 *
 * Expected Results:
 * ✅ Success: "🎉 TESTED ALL X COMBINATIONS SUCCESSFULLY! ✅ Global: No invalid patterns"
 * ❌ Failure: Shows which combination failed and specific Pretty Path Rule violated
 *
 * Example Valid URLs Generated:
 * - `/academy` (all themes - default omitted)
 * - `/academy/digital` (digital theme)
 * - `/academy/design` (design theme)
 * - `/academy/digital?page=2` (digital theme + page > 1 when pagination exists)
 * - `/academy/design?page=3` (combined theme + pagination)
 *
 * Example Invalid URLs That Would Fail Test:
 * - `/academy/all` (❌ "all" theme should be omitted)
 * - `/academy/digital?page=1` (❌ default page should be omitted)
 * 
 * Required Data-TestId Attributes:
 * - `academy-theme-filter` - Theme filter select element
 * - `academy-submit-filter` - Submit button for filters
 * - `academy-reset-filter` - Reset button for filters
 * - Pagination component must have ID: `academy-pagination`
 * 
 * Run Commands:
 * - All tests: `yarn workspace starter playwright:test`
 * - This test: `yarn workspace starter playwright test academy-listings.spec.js`
 * - Report: `yarn workspace starter playwright:show-report`
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "../utils/overlay-handler.js"
import { preventTimeout } from "../utils/combination-limiter.js"
import { testPagination } from "../utils/pagination-tester.js"

test("Academy Listings - Dynamic Pretty Path Rules Validation", async ({ page }) => {
	// Navigate to /academy and handle overlays
	await page.goto("/academy")
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)

	// Discover all available options
	const themeSelect = page.locator('[data-testid="academy-theme-filter"]').first()

	const themeOptions = await themeSelect.locator("option").all()

	// Extract all theme options with their values and texts
	const themes = []
	for (const option of themeOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		themes.push({ value, text: text?.trim() })
	}

	// Pagination E2E (prev/next + every page button × restore) needs far more than 8s per theme.
	const totalCombinations = themes.length
	preventTimeout(test, Math.max(totalCombinations * 5, 30), "Academy Listings")

	let testCount = 0
	const allUrls = []
	const testResults = [] // For console.table output

	// Test all theme combinations
	for (const theme of themes) {
		testCount++
		console.log(`\n--- TEST ${testCount}/${totalCombinations}: ${theme.text} ---`)

		try {
			// Navigate to clean academy page for each test to prevent state contamination
			try {
				await page.goto("/academy")
				await page.waitForLoadState("domcontentloaded")
				await page.waitForTimeout(500)
			} catch (navigationError) {
				console.log(`⚠️ Navigation failed: ${navigationError.message}`)
				throw navigationError // Re-throw to fail the test gracefully
			}

			// Re-locate elements after navigation to ensure fresh references
			const submitButton = page.locator('[data-testid="academy-submit-filter"]').first()
			const currentThemeSelect = page
				.locator('[data-testid="academy-theme-filter"]')
				.first()

			// Clear any existing state first - wait for page to be ready
			await page.waitForTimeout(500)

			// Form selection
			await currentThemeSelect.selectOption(theme.value)
			await page.waitForTimeout(300)
			console.log(`   🎯 Selected theme: ${theme.value}`)

			// Submit filters with timeout protection
			console.log(`   📤 Submitting form...`)
			const submissionStartTime = Date.now()

			try {
				await submitButton.click({ force: true, timeout: 3000 })

				// Wait for navigation and pretty path processing with fallbacks
				await page.waitForTimeout(1000) // Reduced from 1500ms

				try {
					await page.waitForLoadState("domcontentloaded", { timeout: 4000 })
				} catch (loadError) {
					console.log(`⚠️ DOM load timeout, falling back to networkidle`)
					try {
						await page.waitForLoadState("networkidle", { timeout: 2000 })
					} catch (networkError) {
						console.log(`⚠️ Network idle timeout, proceeding with current state`)
					}
				}

				// Additional wait to ensure pretty path processing completes
				await page.waitForTimeout(300) // Further reduced

				const submissionDuration = Date.now() - submissionStartTime
				console.log(`   ✅ Form submission completed in ${submissionDuration}ms`)
			} catch (submissionError) {
				console.log(`⚠️ Form submission error: ${submissionError.message}`)
			}

			const urlAfterSubmit = page.url()
			allUrls.push(urlAfterSubmit)
			console.log(`📍 URL: ${urlAfterSubmit}`)

			// Validate Pretty Path Rules for this combination
			const urlObj = new URL(urlAfterSubmit)
			const pathSegments = urlObj.pathname.split("/").filter((segment) => segment)

			// Extract theme from URL path
			const academyIndex = pathSegments.findIndex((segment) => segment === "academy")
			const themeInUrl = (academyIndex !== -1 && pathSegments[academyIndex + 1]) || null

			// Prepare result object for table
			const result = {
				Test: testCount,
				Theme: `${theme.text} (${theme.value})`,
				URL: urlAfterSubmit,
				ThemeRule: "",
				Pagination: "",
				Status: "✅",
			}

			// Validate theme rules
			if (theme.value !== "all") {
				expect(themeInUrl).toBeTruthy()
				expect(themeInUrl).not.toBe("all")
				result.ThemeRule = `"${themeInUrl}" in path`
				console.log(`✅ Theme: "${themeInUrl}" in path`)
			} else {
				expect(themeInUrl).toBeNull()
				result.ThemeRule = '"all" omitted from path'
				console.log(`✅ Theme: "all" omitted from path`)
			}

			// Block invalid patterns for this URL
			const urlString = urlObj.pathname + urlObj.search
			expect(urlString).not.toMatch(/\/all($|\?)/)
			expect(urlString).not.toContain("page=1")

			// ==========================================
			// 📄 PAGINATION TESTING (using dynamic utility)
			// ==========================================
			// Build pagination configuration specific to academy listing
			const paginationConfig = {
				containerTestId: "academy-pagination-container",
				previousTestId: "academy-pagination-previous",
				nextTestId: "academy-pagination-next",
				pagerTestId: "academy-pagination-pager",
				pageButtonPattern: "academy-pagination-",
			}
			const paginationResult = await testPagination(page, paginationConfig)

			// Add result to results array (with pagination info)
			result.Pagination = paginationResult.tested ? "✅ Tested" : "N/A"
			testResults.push(result)
		} catch (error) {
			console.log(`❌ TEST ${testCount} FAILED: ${error.message}`)

			// Add failed test to results
			testResults.push({
				Test: testCount,
				Theme: `${theme.text} (${theme.value})`,
				URL: page.url(),
				ThemeRule: "FAILED",
				Pagination: "FAILED",
				Status: "❌",
			})

			throw error
		}
	}

	console.log(`\n🎉 TESTED ALL ${testCount} COMBINATIONS SUCCESSFULLY!`)

	// Display results in organized table format
	console.log(`\n📊 DETAILED TEST RESULTS TABLE:`)
	console.table(testResults)

	// Test reset functionality once at the end
	console.log(`\n--- RESET TEST ---`)
	const resetButton = page.locator('[data-testid="academy-reset-filter"]').first()
	await resetButton.click({ force: true })
	await page.waitForTimeout(1000) // Reduced wait time

	const urlAfterReset = page.url()
	console.log(`📍 URL after reset: ${urlAfterReset}`)

	const resetUrlObj = new URL(urlAfterReset)
	expect(resetUrlObj.search).toBe("") // No query parameters
	expect(resetUrlObj.pathname).toContain("/academy")
	expect(resetUrlObj.pathname).not.toContain("/all")
	console.log(`✅ Reset: Clean URL with no query parameters`)

	// Final validation across all tested URLs
	const allUrlsString = allUrls.join(" ")
	expect(allUrlsString).not.toContain("page=1")
	expect(allUrlsString).not.toMatch(/\/all($|\?)/)
	console.log(`✅ Global: No invalid patterns across all ${testCount} combinations`)
})
