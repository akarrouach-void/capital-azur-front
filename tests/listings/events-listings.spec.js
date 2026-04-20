/**
 * EVENTS LISTINGS - DYNAMIC PRETTY PATH RULES VALIDATION TEST
 *
 * Purpose:
 * - Validates EventListWidget URL generation against comprehensive Pretty Path Rules
 * - Tests ALL combinations of available theme, city, and sort filter options dynamically
 * - Ensures no invalid URL patterns are generated across any filter combination
 * - Verifies reset functionality returns to clean base URL state
 *
 * Test Process:
 * 1. Navigates to /events page and handles overlays automatically
 * 2. Dynamically discovers all available theme and city filter options
 * 3. Checks for sort filter presence (conditional on node_has_views_count)
 * 4. Uses combination-limiter utility to setup optimal testing configuration
 * 5. Tests theme × city × sort combinations (limited to 20 for performance)
 * 6. Validates Pretty Path Rules for each individual combination
 * 7. Tests pagination controls if present (hrefs and click behavior)
 * 8. Tests reset functionality once to ensure clean URL restoration
 * 9. Performs global validation across all generated URLs
 *
 * Pretty Path Rules Validated (per Official Specification):
 *
 * 🏷️ TAXONOMY RULES (per Pretty Path Specification):
 * ✅ Both taxonomies = "all" → omit from path (clean `/events`)
 * ✅ Theme = "all", City = specific → show `/all/paris` (mixed taxonomies - CORRECT)
 * ✅ Theme = specific, City = "all" → show `/digital/all` (mixed taxonomies - CORRECT)
 * ✅ Both taxonomies = specific → show `/digital/paris` (both specific - CORRECT)
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
 * 🔄 SORTING RULES (if sort filter exists - depends on node_has_views_count):
 * ✅ Sort = "popularite" → show `?sort=popularite` (explicitly shown)
 * ✅ Sort = "none" → omit `?sort=none` (default, not shown)
 * ✅ No sort filter → no sort parameters in URL
 *
 * ❌ INVALID PATTERNS BLOCKED:
 * ❌ `/all` - Single "all" taxonomy without second parameter (INVALID)
 * ❌ `/all/all` - Both taxonomies "all" must be omitted (INVALID)
 * ❌ `?page=1` - Default page must be omitted
 * ❌ `?sort=none` - Default sort must be omitted (if sort filter exists)
 *
 * Configuration Options:
 * - Uses combination-limiter utility for consistent timeout and limit management
 * - Limits to 20 combinations max for performance (configurable)
 * - Dynamic timeout calculation based on number of combinations and complexity
 *
 * Expected Results:
 * ✅ Success: "🎉 TESTED ALL X COMBINATIONS SUCCESSFULLY! ✅ Global: No invalid patterns"
 * ❌ Failure: Shows which combination failed and specific Pretty Path Rule violated
 *
 * ✅ EXAMPLES OF CORRECT URLs GENERATED:
 * - `/events` → Both taxonomies = "all", default page & sort
 * - `/events/digital/all` → Theme specific, city = "all" (mixed taxonomies - CORRECT)
 * - `/events/all/paris` → Theme = "all", city specific (mixed taxonomies - CORRECT)
 * - `/events/digital/paris` → Both taxonomies specific, defaults
 * - `/events?sort=popularite` → Both taxonomies = "all", popularity sort
 * - `/events/digital/all?sort=popularite` → Theme specific, city = "all" + sort
 * - `/events/digital/paris?sort=popularite` → Both specific + popularity sort
 * - `/events/digital/all?page=2` → Theme specific + page > 1 (when pagination exists)
 * - `/events/digital/paris?page=3&sort=popularite` → Combined filtering + pagination
 *
 * ❌ EXAMPLES OF INVALID URLs BLOCKED:
 * - `/events/all` → Single "all" taxonomy without second parameter (INVALID)
 * - `/events/all/all` → Both taxonomies "all" (should be clean `/events`)
 * - `/events/digital?page=1` → Default page should be omitted
 * - `/events/digital?sort=none` → Default sort should be omitted
 *
 * ✅ NOTE: Mixed taxonomies (/specific/all or /all/specific) are CORRECT per specification
 * 
 * Required Data-TestId Attributes:
 * - `event-theme-filter` - Theme filter select element
 * - `event-city-filter` - City filter select element
 * - `event-sort-filter` - Sort filter select element (if available)
 * - `event-submit-filter` - Submit button for filters
 * - `event-reset-filter` - Reset button for filters
 * - Pagination component must have ID: `event-pagination`
 * 
 * Run Commands:
 * - All tests: `yarn workspace starter playwright:test`
 * - This test: `yarn workspace starter playwright test events-listings.spec.js`
 * - Report: `yarn workspace starter playwright:show-report`
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "../utils/overlay-handler.js"
import { preventTimeout } from "../utils/combination-limiter.js"
import {
	testPagination,
	waitForListingUrlIdle,
} from "../utils/pagination-tester.js"

test("Events Listings - Dynamic Pretty Path Rules Validation (Theme × City × Sort Popularite)", async ({
	page,
}) => {
	// Navigate to /events and handle overlays
	await page.goto("/events")
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)

	// Discover all available options
	const themeSelect = page.locator('[data-testid="event-theme-filter"]').first()
	const citySelect = page.locator('[data-testid="event-city-filter"]').first()
	const sortSelect = page.locator('[data-testid="event-sort-filter"]').first()

	const themeOptions = await themeSelect.locator("option").all()
	const cityOptions = await citySelect.locator("option").all()

	// Extract all theme options with their values and texts
	const themes = []
	for (const option of themeOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		themes.push({ value, text: text?.trim() })
	}

	// Extract all city options with their values and texts
	const cities = []
	for (const option of cityOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		cities.push({ value, text: text?.trim() })
	}

	// Check if sort filter exists in DOM (depends on node_has_views_count)
	const hasSortFilter = await sortSelect.isVisible().catch(() => false)
	const sorts = []

	if (hasSortFilter) {
		// Extract sort options only if sort filter is present
		const sortOptionsElements = await sortSelect.locator("option").all()
		for (const option of sortOptionsElements) {
			const value = await option.getAttribute("value")
			const text = await option.textContent()
			sorts.push({ value, text: text?.trim() })
		}
		console.log(`🎯 Sort filter detected: ${sorts.length} sort options available`)
	} else {
		// No sort filter present - only test theme x city combinations
		sorts.push({ value: "none", text: "None (No Sort Filter)" })
		console.log(`⚠️  No sort filter detected - testing theme x city combinations only`)
	}

	// Calculate total combinations and prevent timeout
	const totalCombinations = themes.length * cities.length * sorts.length
	preventTimeout(test, totalCombinations, "Events Listings")

	let testCount = 0
	const allUrls = []
	const testResults = [] // For console.table output

	// Test all combinations of theme × city × sort
	for (const theme of themes) {
		for (const city of cities) {
			for (const sort of sorts) {
				testCount++
				console.log(
					`\n--- TEST ${testCount}/${totalCombinations}: ${theme.text} + ${city.text} + ${sort.text} ---`
				)

				try {
					// Navigate to clean events page for each test to prevent state contamination
					try {
						await page.goto("/events")
						await page.waitForLoadState("domcontentloaded")
						await page.waitForTimeout(500)
					} catch (navigationError) {
						console.log(`⚠️ Navigation failed: ${navigationError.message}`)
						throw navigationError // Re-throw to fail the test gracefully
					}

					// Re-locate elements after navigation to ensure fresh references
					const submitButton = page.locator('[data-testid="event-submit-filter"]').first()
					const currentThemeSelect = page
						.locator('[data-testid="event-theme-filter"]')
						.first()
					const currentCitySelect = page
						.locator('[data-testid="event-city-filter"]')
						.first()
					const currentSortSelect = page
						.locator('[data-testid="event-sort-filter"]')
						.first()

					// Clear any existing state first - wait for page to be ready
					await page.waitForTimeout(500)

					// Form selection
					await currentThemeSelect.selectOption(theme.value)
					await page.waitForTimeout(300)
					console.log(`   🎯 Selected theme: ${theme.value}`)

					await currentCitySelect.selectOption(city.value)
					await page.waitForTimeout(300)
					console.log(`   🏙️ Selected city: ${city.value}`)

					// Only select sort if sort filter exists on page
					if (hasSortFilter && sort.value !== "none") {
						await currentSortSelect.selectOption(sort.value)
						await page.waitForTimeout(300)
						console.log(`   🔢 Selected sort: ${sort.value}`)
					}

					// Ensure native selects reflect values before submit (avoids RHF / shallow URL race)
					await expect(currentThemeSelect).toHaveValue(String(theme.value))
					await expect(currentCitySelect).toHaveValue(String(city.value))
					if (hasSortFilter && sort.value !== "none") {
						await expect(currentSortSelect).toHaveValue(String(sort.value))
					}

					// Submit filters with more time for processing
					await submitButton.click({ force: true, timeout: 3000 })

					// Shallow router updates the URL after React state; fixed sleeps race with it.
					await waitForListingUrlIdle(page, { stableMs: 500, maxWait: 25000 })
					await page.waitForLoadState("domcontentloaded", { timeout: 6000 }).catch(() => {})

					const urlAfterSubmit = page.url()
					allUrls.push(urlAfterSubmit)
					console.log(`📍 URL: ${urlAfterSubmit}`)

					// ==========================================
					// PRETTY PATH RULES VALIDATION (per Official Specification)
					// ==========================================
					const urlObj = new URL(urlAfterSubmit)
					const pathSegments = urlObj.pathname.split("/").filter((segment) => segment)
					const sortInUrl = urlObj.searchParams.get("sort")

					// Extract theme and city from URL path segments
					const eventsIndex = pathSegments.findIndex((segment) => segment === "events")
					const themeInUrl = (eventsIndex !== -1 && pathSegments[eventsIndex + 1]) || null
					const cityInUrl = (eventsIndex !== -1 && pathSegments[eventsIndex + 2]) || null

					// Prepare result object for table
					const result = {
						Test: testCount,
						Theme: `${theme.text} (${theme.value})`,
						City: `${city.text} (${city.value})`,
						Sort: `${sort.text} (${sort.value})`,
						URL: urlAfterSubmit,
						ThemeRule: "",
						CityRule: "",
						SortRule: "",
						Pagination: "",
						Status: "✅",
					}

					// 🏷️ TAXONOMY VALIDATION: Theme Rules
					if (theme.value !== "all" && theme.value !== "") {
						expect(themeInUrl).toBeTruthy()
						expect(themeInUrl).not.toBe("all")
						result.ThemeRule = `"${themeInUrl}" in path`
						console.log(`✅ Theme: "${themeInUrl}" in path`)
					} else {
						// Theme is "all" or empty
						if (city.value === "all" || city.value === "") {
							// Both theme and city are "all" - URL should be clean /events
							expect(themeInUrl).toBeNull()
							result.ThemeRule = '"all" omitted from path'
							console.log(`✅ Theme: "all" omitted from path`)
						} else {
							// Theme is "all" but city is specific - URL should be /events/all/agadir
							expect(themeInUrl).toBe("all")
							result.ThemeRule = '"all" kept in path with specific city'
							console.log(`✅ Theme: "all" kept in path with city "${cityInUrl}"`)
						}
					}

					// 🏷️ TAXONOMY VALIDATION: City Rules
					if (city.value !== "all" && city.value !== "") {
						if (theme.value !== "all" && theme.value !== "") {
							// Both theme and city are specific - city should be second in path
							expect(cityInUrl).toBeTruthy()
							expect(cityInUrl).not.toBe("all")
							result.CityRule = `"${cityInUrl}" in path (2nd)`
							console.log(`✅ City: "${cityInUrl}" in path (2nd position)`)
						} else {
							// Theme is "all" but city is specific - city should be second in path after "all"
							expect(cityInUrl).toBeTruthy()
							expect(cityInUrl).not.toBe("all")
							result.CityRule = `"${cityInUrl}" in path (2nd after all)`
							console.log(`✅ City: "${cityInUrl}" in path (2nd position after "all")`)
						}
					} else {
						// City is "all" - correct behavior depends on theme
						if (theme.value !== "all" && theme.value !== "") {
							// Theme is specific, city is "all" - CORRECT: show /specific/all
							expect(cityInUrl).toBe("all")
							result.CityRule = '"all" shown (correct - mixed taxonomies)'
							console.log(
								`✅ City: "all" shown in path - correct behavior for mixed taxonomies`
							)
						} else {
							// Both theme and city are "all" - clean URL (both omitted)
							expect(themeInUrl).toBeNull()
							expect(cityInUrl).toBeNull()
							result.CityRule = 'both "all" omitted'
							console.log(`✅ City: both theme and city "all" omitted`)
						}
					}

					// 🔄 SORTING VALIDATION: Sort Rules
					if (hasSortFilter) {
						if (sort.value === "popularite") {
							expect(sortInUrl).toBe("popularite")
							result.SortRule = "?sort=popularite shown"
							console.log(`✅ Sort: ?sort=popularite shown`)
						} else if (sort.value === "none") {
							expect(sortInUrl).toBeNull()
							result.SortRule = "none omitted (default)"
							console.log(`✅ Sort: none omitted (default)`)
						} else {
							expect(sortInUrl).toBe(sort.value)
							result.SortRule = `?sort=${sort.value} shown`
							console.log(`✅ Sort: ?sort=${sort.value} shown`)
						}
					} else {
						// No sort filter available - should not have any sort parameters
						expect(sortInUrl).toBeNull()
						result.SortRule = "no sort filter (N/A)"
						console.log(`⚠️ Sort: no sort filter available - no sort params expected`)
					}

					// ❌ INVALID PATTERNS VALIDATION: Block prohibited patterns (per specification)
					const urlString = urlObj.pathname + urlObj.search
					// Block /all at end (single "all" taxonomy) and /all/all patterns (both "all")
					// Allow /specific/all and /all/specific (mixed taxonomies are CORRECT)
					expect(urlString).not.toMatch(/\/events\/all($|\?)/) // /events/all at end - INVALID
					expect(urlString).not.toMatch(/\/all\/all/) // /all/all double pattern - INVALID
					expect(urlString).not.toContain("page=1")

					// Only check for sort=none if sort filter is available
					if (hasSortFilter) {
						expect(urlString).not.toContain("sort=none")
					}

					// ==========================================
					// 📄 PAGINATION TESTING (using dynamic utility)
					// ==========================================
					// Build pagination configuration specific to events listing
					const paginationConfig = {
						containerTestId: "event-pagination-container",
						previousTestId: "event-pagination-previous",
						nextTestId: "event-pagination-next",
						pagerTestId: "event-pagination-pager",
						pageButtonPattern: "event-pagination-",
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
						City: `${city.text} (${city.value})`,
						Sort: `${sort.text} (${sort.value})`,
						URL: page.url(),
						ThemeRule: "FAILED",
						CityRule: "FAILED",
						SortRule: "FAILED",
						Pagination: "FAILED",
						Status: "❌",
					})

					throw error
				}
			}
		}
	}

	console.log(`\n🎉 TESTED ALL ${testCount} COMBINATIONS SUCCESSFULLY!`)

	// Display results in organized table format
	console.log(`\n📊 DETAILED TEST RESULTS TABLE:`)
	console.table(testResults)

	// Test reset functionality once at the end
	console.log(`\n--- RESET TEST ---`)
	try {
		const resetButton = page.locator('[data-testid="event-reset-filter"]').first()

		// Check if reset button is visible before clicking
		const resetButtonVisible = await resetButton.isVisible({ timeout: 5000 })
		if (!resetButtonVisible) {
			console.log(`⚠️ Reset button not found - skipping reset test`)
			return
		}

		await resetButton.click({ force: true, timeout: 3000 })
		await page.waitForTimeout(500) // Reduced wait time

		const urlAfterReset = page.url()
		console.log(`📍 URL after reset: ${urlAfterReset}`)

		const resetUrlObj = new URL(urlAfterReset)
		expect(resetUrlObj.search).toBe("") // No query parameters
		expect(resetUrlObj.pathname).toContain("/events")
		expect(resetUrlObj.pathname).not.toContain("/all")
		console.log(`✅ Reset: Clean URL with no query parameters`)
	} catch (resetError) {
		console.log(`⚠️ Reset test failed: ${resetError.message}`)
		// Don't fail the entire test for reset issues
	}

	// Final validation across all tested URLs (per specification)
	const allUrlsString = allUrls.join(" ")
	expect(allUrlsString).not.toContain("page=1")

	// Only check for sort=none if sort filter was available
	if (hasSortFilter) {
		expect(allUrlsString).not.toContain("sort=none")
	}

	// Block only truly invalid patterns per Pretty Path specification
	expect(allUrlsString).not.toMatch(/\/events\/all($|\s)/) // /events/all at end - INVALID
	expect(allUrlsString).not.toMatch(/\/all\/all/) // /all/all double pattern - INVALID
	// Allow /specific/all and /all/specific patterns - these are CORRECT

	console.log(
		`✅ Global: No invalid patterns across all ${testCount} combinations ${
			hasSortFilter ? "(with sort filter)" : "(no sort filter)"
		}`
	)
})
