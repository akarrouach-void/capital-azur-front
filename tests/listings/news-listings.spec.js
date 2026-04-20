/**
 * NEWS LISTINGS - DYNAMIC PRETTY PATH RULES VALIDATION TEST
 *
 * Purpose:
 * - Validates NewsListWidget URL generation against comprehensive Pretty Path Rules
 * - Tests ALL combinations of available theme and sort filter options dynamically
 * - Ensures no invalid URL patterns are generated across any filter combination
 * - Verifies reset functionality returns to clean base URL state
 *
 * Test Process:
 * 1. Navigates to /news page and handles overlays automatically
 * 2. Dynamically discovers all available theme and sort filter options
 * 3. Calculates dynamic timeout based on number of combinations to test
 * 4. Tests every theme × sort combination
 * 5. Validates Pretty Path Rules for each individual combination
 * 6. Tests pagination controls if present (hrefs and click behavior)
 * 7. Tests reset functionality once to ensure clean URL restoration
 * 8. Performs global validation across all generated URLs
 *
 * Pretty Path Rules Validated:
 * ✅ Taxonomy = specific value → show `/digital` in path (not `/all`)
 * ✅ Taxonomy = "all" → omit from path completely (no `/all` segment)
 * ✅ Sort = "asc" → show `?sort=asc` in query parameters
 * ✅ Sort = "desc" → omit `?sort=desc` (default, not shown)
 * ✅ Sort = custom → show `?sort=custom` (e.g., `?sort=popularite`)
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
 * ❌ `?sort=desc` - Default sort parameter must be omitted
 * ❌ `/all/all` - Multiple "all" taxonomies (if multiple taxonomies exist)
 *
 * Expected Results:
 * ✅ Success: "🎉 TESTED ALL X COMBINATIONS SUCCESSFULLY! ✅ Global: No invalid patterns"
 * ❌ Failure: Shows which combination failed and specific Pretty Path Rule violated
 *
 * Example Valid URLs Generated:
 * - `/news` (all themes + desc sort - both defaults omitted)
 * - `/news?sort=asc` (all themes + asc sort)
 * - `/news/digital` (digital theme + desc sort)
 * - `/news/digital?sort=asc` (digital theme + asc sort)
 * - `/news/culture?sort=popularite` (culture theme + popularity sort)
 * - `/news/digital?page=2` (digital theme + page > 1 when pagination exists)
 * - `/news/digital?page=3&sort=asc` (combined filtering + pagination)
 *
 * Example Invalid URLs That Would Fail Test:
 * - `/news/all` (❌ "all" theme should be omitted)
 * - `/news/digital?page=1` (❌ default page should be omitted)
 * - `/news/digital?sort=desc` (❌ default sort should be omitted)
 * 
 * Required Data-TestId Attributes:
 * - `news-theme-filter` - Theme filter select element
 * - `news-sort-filter` - Sort filter select element
 * - `news-submit-filter` - Submit button for filters
 * - `news-reset-filter` - Reset button for filters
 * - Pagination component must have ID: `news-pagination`
 * 
 * Run Commands:
 * - All tests: `yarn workspace starter playwright:test`
 * - This test: `yarn workspace starter playwright test news-listings.spec.js`
 * - Report: `yarn workspace starter playwright:show-report`
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "../utils/overlay-handler.js"
import { preventTimeout } from "../utils/combination-limiter.js"
import { testPagination } from "../utils/pagination-tester.js"

test("News Listings - Dynamic Pretty Path Rules Validation", async ({ page }) => {
	// Navigate to /news and handle overlays
	await page.goto("/news")
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)

	// Discover all available options
	const themeSelect = page.locator('[data-testid="news-theme-filter"]').first()
	const sortSelect = page.locator('[data-testid="news-sort-filter"]').first()

	const themeOptions = await themeSelect.locator("option").all()
	const sortOptions = await sortSelect.locator("option").all()

	// Extract all theme options with their values and texts
	const themes = []
	for (const option of themeOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		themes.push({ value, text: text?.trim() })
	}

	// Extract all sort options with their values and texts
	const sorts = []
	for (const option of sortOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		sorts.push({ value, text: text?.trim() })
	}

	// Calculate total combinations and prevent timeout
	const totalCombinations = themes.length * sorts.length
	preventTimeout(test, totalCombinations, "News Listings")

	let testCount = 0
	const allUrls = []
	const testResults = [] // For console.table output

	// Test all combinations of theme × sort
	for (const theme of themes) {
		for (const sort of sorts) {
			testCount++

			try {
				const submitButton = page.locator('[data-testid="news-submit-filter"]').first()

				// Quick selection without extensive waiting
				await themeSelect.selectOption(theme.value)
				await sortSelect.selectOption(sort.value)

				// Submit filters - simplified
				await submitButton.click({ force: true, timeout: 2000 })
				await page.waitForTimeout(800) // Reduced wait time

				const urlAfterSubmit = page.url()
				allUrls.push(urlAfterSubmit)
				console.log(`📍 URL: ${urlAfterSubmit}`)

				// Validate Pretty Path Rules for this combination
				const urlObj = new URL(urlAfterSubmit)
				const pathSegments = urlObj.pathname.split("/").filter((segment) => segment)
				const sortInUrl = urlObj.searchParams.get("sort")

				// Extract theme from URL path
				const newsIndex = pathSegments.findIndex((segment) => segment === "news")
				const themeInUrl = (newsIndex !== -1 && pathSegments[newsIndex + 1]) || null

				// Prepare result object for table
				const result = {
					Test: testCount,
					Theme: `${theme.text} (${theme.value})`,
					Sort: `${sort.text} (${sort.value})`,
					URL: urlAfterSubmit,
					ThemeRule: "",
					SortRule: "",
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

				// Validate sort rules
				if (sort.value === "asc") {
					expect(sortInUrl).toBe("asc")
					result.SortRule = "?sort=asc shown"
					console.log(`✅ Sort: ?sort=asc shown`)
				} else if (sort.value === "desc") {
					expect(sortInUrl).toBeNull()
					result.SortRule = "desc omitted (default)"
					console.log(`✅ Sort: desc omitted (default)`)
				} else {
					expect(sortInUrl).toBe(sort.value)
					result.SortRule = `?sort=${sort.value} shown`
					console.log(`✅ Sort: ?sort=${sort.value} shown`)
				}

				// Block invalid patterns for this URL
				const urlString = urlObj.pathname + urlObj.search
				expect(urlString).not.toMatch(/\/all($|\?)/)
				expect(urlString).not.toContain("page=1")
				expect(urlString).not.toContain("sort=desc")

				// ==========================================
				// 📄 PAGINATION TESTING (using dynamic utility)
				// ==========================================
				// Build pagination configuration specific to news listing
				const paginationConfig = {
					containerTestId: "news-pagination-container",
					previousTestId: "news-pagination-previous",
					nextTestId: "news-pagination-next",
					pagerTestId: "news-pagination-pager",
					pageButtonPattern: "news-pagination-",
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
					Sort: `${sort.text} (${sort.value})`,
					URL: page.url(),
					ThemeRule: "FAILED",
					SortRule: "FAILED",
					Pagination: "FAILED",
					Status: "❌",
				})

				throw error
			}
		}
	}

	console.log(`\n🎉 TESTED ALL ${testCount} COMBINATIONS SUCCESSFULLY!`)

	// Display results in organized table format
	console.log(`\n📊 DETAILED TEST RESULTS TABLE:`)
	console.table(testResults)

	// Test reset functionality once at the end
	console.log(`\n--- RESET TEST ---`)
	const resetButton = page.locator('[data-testid="news-reset-filter"]').first()
	await resetButton.click({ force: true })
	await page.waitForTimeout(1000) // Reduced wait time

	const urlAfterReset = page.url()
	console.log(`📍 URL after reset: ${urlAfterReset}`)

	const resetUrlObj = new URL(urlAfterReset)
	expect(resetUrlObj.search).toBe("") // No query parameters
	expect(resetUrlObj.pathname).toContain("/news")
	expect(resetUrlObj.pathname).not.toContain("/all")
	console.log(`✅ Reset: Clean URL with no query parameters`)

	// Final validation across all tested URLs
	const allUrlsString = allUrls.join(" ")
	expect(allUrlsString).not.toContain("page=1")
	expect(allUrlsString).not.toContain("sort=desc")
	expect(allUrlsString).not.toMatch(/\/all($|\?)/)
	console.log(`✅ Global: No invalid patterns across all ${testCount} combinations`)
})
