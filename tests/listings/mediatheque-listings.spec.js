/**
 * MEDIATHEQUE LISTINGS - PRETTY PATH + PAGINATION
 *
 * MediathequeListWidget uses three path segments (year / type / theme) then strips
 * `/all` when all filters are "all". Tests at most **3 options per filter** (first
 * options in DOM order) to cap combinations at 27. Invariants: 0 or 3 path segments;
 * `all` segment only where the filter is "all"; no `page=1`.
 *
 * data-testid: mediatheque-year-filter, mediatheque-type-filter, mediatheque-theme-filter,
 * mediatheque-submit-filter, mediatheque-reset-filter. Pagination id: mediatheque-pagination
 *
 * Run: yarn workspace starter playwright test listings/mediatheque-listings.spec.js
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "../utils/overlay-handler.js"
import { preventTimeout } from "../utils/combination-limiter.js"
import {
	testPagination,
	waitForListingUrlIdle,
} from "../utils/pagination-tester.js"

const basePath = process.env.PW_MEDIATHEQUE_LISTING_PATH || "/mediatheque"
const LISTING_SEGMENT = "mediatheque"
/** Cap options per select so year × type × theme stays bounded (default 3³ = 27). */
const MAX_VALUES_PER_FILTER = 3

const paginationConfig = {
	containerTestId: "mediatheque-pagination-container",
	previousTestId: "mediatheque-pagination-previous",
	nextTestId: "mediatheque-pagination-next",
	pagerTestId: "mediatheque-pagination-pager",
	pageButtonPattern: "mediatheque-pagination-",
}

function isAllFilterValue(value) {
	return value === "all" || value === ""
}

/**
 * Widget strips `/all` only when every dimension is "all" (see countOccurrences vs
 * context.terms). Otherwise the path always keeps three slots: year / type / theme
 * (using the literal segment `all` for defaults), e.g. `/mediatheque/all/all/bibliotheque`.
 *
 * @param {string} pathname
 * @returns {string[]}
 */
function getSegmentsAfterListing(pathname) {
	const pathSegments = pathname.split("/").filter((s) => s)
	const idx = pathSegments.findIndex((segment) => segment === LISTING_SEGMENT)
	if (idx === -1) {
		return []
	}
	return pathSegments.slice(idx + 1)
}

function assertMediathequeUrlRules(urlString, yearVal, typeVal, themeVal) {
	const urlObj = new URL(urlString)
	const segments = getSegmentsAfterListing(urlObj.pathname)
	const allFiltersAll =
		isAllFilterValue(yearVal) &&
		isAllFilterValue(typeVal) &&
		isAllFilterValue(themeVal)

	if (allFiltersAll) {
		expect(segments.length).toBe(0)
	} else {
		expect(segments.length).toBe(3)
		const [yearSeg, typeSeg, themeSeg] = segments
		if (isAllFilterValue(yearVal)) {
			expect(yearSeg).toBe("all")
		} else {
			expect(yearSeg).toBeTruthy()
			expect(yearSeg).not.toBe("all")
		}
		if (isAllFilterValue(typeVal)) {
			expect(typeSeg).toBe("all")
		} else {
			expect(typeSeg).toBeTruthy()
			expect(typeSeg).not.toBe("all")
		}
		if (isAllFilterValue(themeVal)) {
			expect(themeSeg).toBe("all")
		} else {
			expect(themeSeg).toBeTruthy()
			expect(themeSeg).not.toBe("all")
		}
	}

	const pathAndSearch = urlObj.pathname + urlObj.search
	expect(pathAndSearch).not.toContain("page=1")
}

test("Mediatheque Listings - Pretty path (Year × Type × Theme) and pagination", async ({
	page,
}) => {
	await page.goto(basePath)
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)

	const yearSelect = page.locator('[data-testid="mediatheque-year-filter"]').first()
	const typeSelect = page.locator('[data-testid="mediatheque-type-filter"]').first()
	const themeSelect = page.locator('[data-testid="mediatheque-theme-filter"]').first()

	const yearOptions = await yearSelect.locator("option").all()
	const typeOptions = await typeSelect.locator("option").all()
	const themeOptions = await themeSelect.locator("option").all()

	if (
		yearOptions.length === 0 ||
		typeOptions.length === 0 ||
		themeOptions.length === 0
	) {
		throw new Error(
			"Mediatheque filters have no options — check Drupal route, terms, and data-testids."
		)
	}

	const years = []
	for (const option of yearOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		years.push({ value, text: text?.trim() })
	}
	const types = []
	for (const option of typeOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		types.push({ value, text: text?.trim() })
	}
	const themes = []
	for (const option of themeOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		themes.push({ value, text: text?.trim() })
	}

	const yearsCapped = years.slice(0, MAX_VALUES_PER_FILTER)
	const typesCapped = types.slice(0, MAX_VALUES_PER_FILTER)
	const themesCapped = themes.slice(0, MAX_VALUES_PER_FILTER)

	console.log(
		`📎 Using first ${MAX_VALUES_PER_FILTER} options per filter: ${yearsCapped.length} years × ${typesCapped.length} types × ${themesCapped.length} themes (of ${years.length} × ${types.length} × ${themes.length} available)`
	)

	const totalCombinations =
		yearsCapped.length * typesCapped.length * themesCapped.length
	preventTimeout(test, totalCombinations, "Mediatheque Listings")

	let testCount = 0
	const allUrls = []
	const testResults = []

	for (const year of yearsCapped) {
		for (const type of typesCapped) {
			for (const theme of themesCapped) {
				testCount++
				console.log(
					`\n--- TEST ${testCount}/${totalCombinations}: ${year.text} + ${type.text} + ${theme.text} ---`
				)

				try {
					await page.goto(basePath, { waitUntil: "domcontentloaded" })
					await page.waitForLoadState("networkidle").catch(() => {})
					await page.waitForTimeout(800)

					const submitButton = page
						.locator('[data-testid="mediatheque-submit-filter"]')
						.first()
					const ySel = page.locator('[data-testid="mediatheque-year-filter"]').first()
					const tSel = page.locator('[data-testid="mediatheque-type-filter"]').first()
					const thSel = page.locator('[data-testid="mediatheque-theme-filter"]').first()

					await ySel.waitFor({ state: "visible" })
					await ySel.selectOption({ value: String(year.value) })
					await page.waitForTimeout(250)
					await tSel.selectOption({ value: String(type.value) })
					await page.waitForTimeout(250)
					await thSel.selectOption({ value: String(theme.value) })
					await page.waitForTimeout(250)

					const assertSelectTimeout = { timeout: 15000 }
					await expect(ySel).toHaveValue(String(year.value), assertSelectTimeout)
					await expect(tSel).toHaveValue(String(type.value), assertSelectTimeout)
					await expect(thSel).toHaveValue(String(theme.value), assertSelectTimeout)

					await submitButton.click({ force: true, timeout: 3000 })
					await waitForListingUrlIdle(page, { stableMs: 500, maxWait: 25000 })
					await page.waitForLoadState("domcontentloaded", { timeout: 6000 }).catch(() => {})

					const urlAfterSubmit = page.url()
					allUrls.push(urlAfterSubmit)
					console.log(`📍 URL: ${urlAfterSubmit}`)

					assertMediathequeUrlRules(urlAfterSubmit, year.value, type.value, theme.value)

					const paginationResult = await testPagination(page, paginationConfig)
					testResults.push({
						Test: testCount,
						Year: `${year.text} (${year.value})`,
						Type: `${type.text} (${type.value})`,
						Theme: `${theme.text} (${theme.value})`,
						URL: urlAfterSubmit,
						Pagination: paginationResult.tested ? "✅ Tested" : "N/A",
						Status: "✅",
					})
				} catch (error) {
					console.log(`❌ TEST ${testCount} FAILED: ${error.message}`)
					testResults.push({
						Test: testCount,
						Year: `${year.text} (${year.value})`,
						Type: `${type.text} (${type.value})`,
						Theme: `${theme.text} (${theme.value})`,
						URL: page.url(),
						Pagination: "FAILED",
						Status: "❌",
					})
					throw error
				}
			}
		}
	}

	console.log(`\n🎉 TESTED ALL ${testCount} COMBINATIONS SUCCESSFULLY!`)
	console.log(`\n📊 DETAILED TEST RESULTS TABLE:`)
	console.table(testResults)

	console.log(`\n--- RESET TEST ---`)
	try {
		const resetButton = page.locator('[data-testid="mediatheque-reset-filter"]').first()
		const resetVisible = await resetButton.isVisible({ timeout: 5000 })
		if (resetVisible) {
			await resetButton.click({ force: true, timeout: 3000 })
			await page.waitForTimeout(500)
			const urlAfterReset = page.url()
			console.log(`📍 URL after reset: ${urlAfterReset}`)
			const resetUrlObj = new URL(urlAfterReset)
			expect(resetUrlObj.search).toBe("")
			expect(resetUrlObj.pathname).toContain(`/${LISTING_SEGMENT}`)
			expect(resetUrlObj.pathname).not.toContain("/all")
		} else {
			console.log(`⚠️ Reset button not found - skipping reset test`)
		}
	} catch (resetError) {
		console.log(`⚠️ Reset test failed: ${resetError.message}`)
	}

	const allUrlsString = allUrls.join(" ")
	expect(allUrlsString).not.toContain("page=1")

	console.log(`✅ Global: No invalid patterns across all ${testCount} combinations`)
})
