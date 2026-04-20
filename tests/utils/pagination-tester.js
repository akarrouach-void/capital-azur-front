/**
 * PAGINATION TESTER UTILITY - Reusable pagination testing for listing pages
 *
 * This utility provides comprehensive pagination testing functionality that can be used
 * across different listing tests (news, events, etc.) with configurable test IDs.
 *
 * Features:
 * - Smart pagination detection (container + functional buttons)
 * - Previous button testing (navigates to appropriate page for functionality test)
 * - Next button testing (navigates to appropriate page for functionality test)
 * - Page number button testing with parameter preservation validation
 * - Pretty Path Rules validation for pagination URLs
 * - Comprehensive results table with href validation and click testing
 * - Automatic URL restoration after each test
 *
 * Usage:
 * ```javascript
 * import { testPagination } from "../utils/pagination-tester.js"
 *
 * // Build configuration object in your test (minimal required config)
 * const paginationConfig = {
 *   containerTestId: "event-pagination-container",
 *   previousTestId: "event-pagination-previous",
 *   nextTestId: "event-pagination-next",
 *   pagerTestId: "event-pagination-pager",
 *   pageButtonPattern: "event-pagination-"
 *   // All query parameters are automatically preserved during pagination
 * }
 * const paginationResult = await testPagination(page, paginationConfig)
 *
 * // Optional: Override defaults if needed
 * const customConfig = {
 *   ...paginationConfig,
 *   maxPagesToTest: 3, // Limit pages tested (default: null = test all)
 *   enableDetailedLogging: false // Disable logging (default: true)
 * }
 * ```
 */

/**
 * Default configuration for pagination testing
 */
export const DEFAULT_PAGINATION_CONFIG = {
	containerTestId: "pagination-container",
	previousTestId: "pagination-previous",
	nextTestId: "pagination-next",
	pagerTestId: "pagination-pager",
	pageButtonPattern: "pagination-", // Will be used as data-testid^="pagination-"
	maxPagesToTest: null, // null = test all pages, no limit
	enableDetailedLogging: true,
	testClickBehavior: true,
	validateParameterPreservation: true,
	// Optional: Custom parameter preservation logic
	customParameterValidator: null, // Function to validate custom parameters
}

/**
 * Returns true when a Playwright URL matches a relative href (pathname + search only).
 */
export function urlMatchesHref(pageUrl, hrefRelative, baseUrl) {
	const target = new URL(hrefRelative, baseUrl)
	return pageUrl.pathname === target.pathname && pageUrl.search === target.search
}

/**
 * Waits until the browser URL matches the given relative href (pathname + search).
 */
export async function waitForUrlMatchingHref(
	page,
	hrefRelative,
	baseUrl,
	timeout = 20000
) {
	await page.waitForURL((u) => urlMatchesHref(u, hrefRelative, baseUrl), {
		timeout,
	})
}

/**
 * Listing pagination uses <a> + preventDefault and shallow router.push after React state.
 * Click first, then poll until pathname/search match, with a short stability check.
 */
export async function waitForUrlAfterListingNav(
	page,
	hrefRelative,
	baseUrl,
	timeout = 25000
) {
	const deadline = Date.now() + timeout
	const target = new URL(hrefRelative, baseUrl)

	while (Date.now() < deadline) {
		const u = new URL(page.url())
		if (u.pathname === target.pathname && u.search === target.search) {
			await page.waitForTimeout(120)
			const u2 = new URL(page.url())
			if (u2.pathname === target.pathname && u2.search === target.search) {
				return page.url()
			}
		}
		await page.waitForTimeout(75)
	}

	return page.url()
}

/**
 * After filter submit on listing pages: wait until page.url() is stable (shallow routing).
 */
export async function waitForListingUrlIdle(
	page,
	{ stableMs = 500, maxWait = 25000 } = {}
) {
	const deadline = Date.now() + maxWait
	let last = page.url()
	let stableAccum = 0

	while (Date.now() < deadline) {
		if (page.isClosed()) {
			return last
		}
		try {
			await page.waitForTimeout(80)
		} catch {
			return last
		}
		const cur = page.url()
		if (cur === last) {
			stableAccum += 80
			if (stableAccum >= stableMs) {
				return cur
			}
		} else {
			last = cur
			stableAccum = 0
		}
	}

	try {
		return page.url()
	} catch {
		return last
	}
}

async function waitForPaginationContainer(page, config) {
	const container = page.locator(`[data-testid="${config.containerTestId}"]`)
	await container.waitFor({ state: "visible", timeout: 15000 }).catch(() => {})
	await page.waitForTimeout(150)
}

/**
 * Control inside the pagination nav only (avoids matching nodes outside the nav).
 */
function paginationControlLocator(page, config, controlTestId) {
	return page
		.locator(`[data-testid="${config.containerTestId}"]`)
		.locator(`[data-testid="${controlTestId}"]`)
}

/**
 * Clicks a pagination link without relying on scrollIntoViewIfNeeded: listing re-renders
 * (framer-motion, fetch) can detach nodes during scroll stability checks.
 */
async function clickPaginationControl(page, config, controlTestId) {
	const loc = paginationControlLocator(page, config, controlTestId)
	await loc.first().waitFor({ state: "attached", timeout: 15000 })
	try {
		await loc.first().scrollIntoViewIfNeeded({ timeout: 2500 })
	} catch {
		// ignore — detached during scroll
	}
	try {
		await loc.first().click({ force: true, timeout: 5000 })
	} catch {
		await loc.first().evaluate((el) => {
			if (el instanceof HTMLElement) {
				el.click()
			}
		})
	}
}

/**
 * Helper function to build expected href based on Pretty Path Rules
 * @param {number} pageNum - Target page number
 * @param {string} currentUrl - Current page URL
 * @returns {string} Expected relative href for the page
 */
function buildExpectedHref(pageNum, currentUrl) {
	const urlObj = new URL(currentUrl)
	const pathname = urlObj.pathname
	const searchParams = new URLSearchParams(urlObj.search)

	if (pageNum === 1) {
		// Page 1: Remove page parameter completely (Pretty Path Rule)
		searchParams.delete("page")
		const query = searchParams.toString()
		return pathname + (query ? `?${query}` : "")
	} else {
		// Page 2+: New parameter order - sort FIRST, then page, then other parameters
		const newParams = new URLSearchParams()

		// Add sort parameter first (if it exists)
		if (searchParams.has("sort")) {
			newParams.set("sort", searchParams.get("sort"))
		}

		// Add page parameter second
		newParams.set("page", pageNum.toString())

		// Add all other parameters after sort and page
		for (const [key, value] of searchParams.entries()) {
			if (key !== "page" && key !== "sort") {
				newParams.set(key, value)
			}
		}

		return pathname + "?" + newParams.toString()
	}
}

/**
 * Detects if pagination exists and is functional on the page
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @returns {Promise<{hasPagination: boolean, buttonCount: number, totalPages: number}>}
 */
export async function detectPagination(page, config = {}) {
	const fullConfig = { ...DEFAULT_PAGINATION_CONFIG, ...config }

	try {
		const containerSelector = `[data-testid="${fullConfig.containerTestId}"]`
		const paginationContainer = page.locator(containerSelector)

		// Check if container exists and is visible
		const containerVisible = await paginationContainer.isVisible({ timeout: 2000 })

		if (!containerVisible) {
			return { hasPagination: false, buttonCount: 0, totalPages: 1 }
		}

		// Check for actual pagination buttons
		const paginationButtons = page.locator(
			`[data-testid^="${fullConfig.pageButtonPattern}"]`
		)
		const buttonCount = await paginationButtons.count()

		// Check for specific button types to ensure it's real pagination
		const nextButton = paginationControlLocator(page, fullConfig, fullConfig.nextTestId)
		const pagerContainer = page.locator(`[data-testid="${fullConfig.pagerTestId}"]`)

		const hasNextButton = await nextButton
			.first()
			.isVisible()
			.catch(() => false)
		const hasPagerContainer = await pagerContainer.isVisible().catch(() => false)

		// Only consider it real pagination if we have buttons and structure
		const hasPagination = buttonCount > 0 && (hasNextButton || hasPagerContainer)

		// Determine total pages by checking available page buttons
		const pagerContainerElement = page.locator(
			`[data-testid="${fullConfig.pagerTestId}"]`
		)
		const pageButtonsForCount = pagerContainerElement.locator(
			`[data-testid^="${fullConfig.pageButtonPattern}"]`
		)
		const totalPageButtons = await pageButtonsForCount.count()
		const currentUrl = page.url()
		const currentPage = parseInt(new URL(currentUrl).searchParams.get("page") || "1")
		const totalPages = Math.max(totalPageButtons, currentPage)

		if (containerVisible && !hasPagination && fullConfig.enableDetailedLogging) {
			console.log(
				`⚠️ Pagination container found but no functional buttons (${buttonCount} buttons) - skipping pagination test`
			)
		}

		return { hasPagination, buttonCount, totalPages }
	} catch (error) {
		if (fullConfig.enableDetailedLogging) {
			console.log(`⚠️ Error checking pagination: ${error.message}`)
		}
		return { hasPagination: false, buttonCount: 0, totalPages: 1 }
	}
}

/**
 * Helper function to handle navigation to page 2 for Previous button testing
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @returns {Promise<void>}
 */
async function navigateToPage2ForPreviousTesting(page, config) {
	if (config.enableDetailedLogging) {
		console.log(`   ⏭️ Navigating to page 2 to test Previous button functionality`)
	}
	const page2Id = `${config.pageButtonPattern}2`
	const page2Button = paginationControlLocator(page, config, page2Id)
	if (await page2Button.first().isVisible()) {
		try {
			const baseBeforeClick = page.url()
			const expectedPage2 = buildExpectedHref(2, baseBeforeClick)
			await clickPaginationControl(page, config, page2Id)
			await waitForUrlAfterListingNav(page, expectedPage2, baseBeforeClick, 25000)
			await waitForPaginationContainer(page, config)
		} catch (clickError) {
			if (config.enableDetailedLogging) {
				console.log(`⚠️ Failed to navigate to page 2: ${clickError.message}`)
			}
		}
	}
}

/**
 * Helper function to validate Previous button href
 * @param {string|null} prevHref - Previous button href attribute
 * @param {number} actualTestPage - Current page number
 * @param {string} testUrl - Current test URL
 * @returns {Object} Validation result with expectedHref, isValid, and validationNote
 */
function validatePreviousButtonHref(prevHref, actualTestPage, testUrl) {
	let expectedHref, isValid, validationNote

	if (actualTestPage === 1) {
		expectedHref = "#."
		isValid = prevHref === "#." || prevHref === null
		validationNote = "Should be disabled on first page"
	} else {
		expectedHref = buildExpectedHref(actualTestPage - 1, testUrl)
		// Strict validation - href must match expected href exactly
		isValid = prevHref === expectedHref
		validationNote = `Should point to page ${actualTestPage - 1}`
	}

	return { expectedHref, isValid, validationNote }
}

/**
 * Helper function to test Previous button click behavior
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @param {Object} buttonData - Button-related data: {prevVisible, prevHref}
 * @param {Object} testContext - Test context: {actualTestPage, expectedHref, testUrl}
 * @returns {Promise<{clickResultUrl: string, clickMatches: boolean}>}
 */
async function testPreviousButtonClick(page, config, buttonData, testContext) {
	const { prevVisible, prevHref } = buttonData
	const { actualTestPage, expectedHref, testUrl } = testContext

	let clickResultUrl = "Not tested"
	let clickMatches = false

	if (!config.testClickBehavior) {
		return { clickResultUrl, clickMatches }
	}

	try {
		if (prevVisible && prevHref && prevHref !== "#." && actualTestPage > 1) {
			const baseBeforeClick = page.url()
			await clickPaginationControl(page, config, config.previousTestId)
			clickResultUrl = await waitForUrlAfterListingNav(
				page,
				expectedHref,
				baseBeforeClick,
				25000
			)
			clickMatches = urlMatchesHref(new URL(clickResultUrl), expectedHref, testUrl)
		} else {
			clickResultUrl = actualTestPage === 1 ? "Disabled (page 1)" : "Not functional"
			clickMatches = true
		}
	} catch (error) {
		clickResultUrl = `Click failed: ${error.message}`
		clickMatches = false
	}

	return { clickResultUrl, clickMatches }
}

/**
 * Helper function to restore URL after testing
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @param {string} originalUrl - URL to restore
 * @param {string} context - Context for error messages
 * @returns {Promise<void>}
 */
async function restoreOriginalUrl(page, config, originalUrl, context = "test") {
	try {
		await page.goto(originalUrl, { waitUntil: "domcontentloaded" })
		await page.waitForTimeout(300)
		await waitForPaginationContainer(page, config)
		await waitForListingUrlIdle(page, { stableMs: 300, maxWait: 8000 })
	} catch (restoreError) {
		if (config.enableDetailedLogging) {
			console.log(`⚠️ ${context} - Failed to restore URL: ${restoreError.message}`)
		}
	}
}

/**
 * Helper function to create single-page result for Previous button
 * @returns {Object} Result object for single page scenario
 */
function createSinglePagePreviousResult() {
	return {
		Button: "Previous",
		"Expected Href": "N/A",
		"Actual Href": "Single page",
		"URL After Click": "Single page",
		"Href Valid": "⚠️",
		"Click Matches": "⚠️",
		"Validation Note": "Only 1 page - Previous not testable",
	}
}

/**
 * Tests Previous button functionality with smart navigation
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @param {number} totalPages - Total number of pages
 * @param {string} originalUrl - Original URL to restore after test
 * @returns {Promise<Object|null>} Test result object or null if button doesn't exist
 */
async function testPreviousButton(page, config, totalPages, originalUrl) {
	const prevButton = paginationControlLocator(page, config, config.previousTestId)
	const prevButtonExists = (await prevButton.count()) > 0

	if (!prevButtonExists) {
		return null
	}

	if (totalPages <= 1) {
		return createSinglePagePreviousResult()
	}

	const currentPage = parseInt(new URL(page.url()).searchParams.get("page") || "1")

	// If we're on page 1, navigate to page 2 to test Previous button functionality
	if (currentPage === 1) {
		await navigateToPage2ForPreviousTesting(page, config)
	}

	// Get current URL after potential navigation
	const testUrl = page.url()
	const actualTestPage = parseInt(new URL(testUrl).searchParams.get("page") || "1")

	// Wait for potential server-to-client href conversion (IDs → slugs)
	await page.waitForTimeout(150)

	const prevHref = await prevButton
		.first()
		.getAttribute("href")
		.catch(() => null)
	const prevVisible = await prevButton
		.first()
		.isVisible()
		.catch(() => false)

	// Validate href
	const { expectedHref, isValid, validationNote } = validatePreviousButtonHref(
		prevHref,
		actualTestPage,
		testUrl
	)

	// Test click behavior
	const buttonData = { prevVisible, prevHref }
	const testContext = { actualTestPage, expectedHref, testUrl }
	const { clickResultUrl, clickMatches } = await testPreviousButtonClick(
		page,
		config,
		buttonData,
		testContext
	)

	// Navigate back to original URL for next test
	await restoreOriginalUrl(page, config, originalUrl, "Previous button test")

	return {
		Button: "Previous",
		"Expected Href": expectedHref,
		"Actual Href": prevHref || "null",
		"URL After Click": clickResultUrl,
		"Href Valid": isValid ? "✅" : "❌",
		"Click Matches": clickMatches ? "✅" : "❌",
		"Validation Note": validationNote,
	}
}

/**
 * Helper function to handle navigation to page 1 for Next button testing
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @returns {Promise<void>}
 */
async function navigateToPage1ForNextTesting(page, config) {
	if (config.enableDetailedLogging) {
		console.log(`   ⏮️ Navigating to page 1 to test Next button functionality`)
	}
	const page1Id = `${config.pageButtonPattern}1`
	const page1Button = paginationControlLocator(page, config, page1Id)
	if (await page1Button.first().isVisible()) {
		try {
			const baseBeforeClick = page.url()
			const expectedPage1 = buildExpectedHref(1, baseBeforeClick)
			await clickPaginationControl(page, config, page1Id)
			await waitForUrlAfterListingNav(page, expectedPage1, baseBeforeClick, 25000)
			await waitForPaginationContainer(page, config)
		} catch (clickError) {
			if (config.enableDetailedLogging) {
				console.log(`⚠️ Failed to navigate to page 1: ${clickError.message}`)
			}
		}
	}
}

/**
 * Helper function to validate Next button href
 * @param {string|null} nextHref - Next button href attribute
 * @param {number} actualTestPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {string} testUrl - Current test URL
 * @returns {Object} Validation result with expectedHref, isValid, and validationNote
 */
function validateNextButtonHref(nextHref, actualTestPage, totalPages, testUrl) {
	let expectedHref, isValid, validationNote
	const isLastPage = actualTestPage >= totalPages || nextHref === "#."

	if (isLastPage) {
		expectedHref = "#."
		isValid = nextHref === "#." || nextHref === null
		validationNote = "Should be disabled on last page"
	} else {
		expectedHref = buildExpectedHref(actualTestPage + 1, testUrl)
		// Strict validation - href must match expected href exactly
		isValid = nextHref === expectedHref
		validationNote = `Should point to page ${actualTestPage + 1}`
	}

	return { expectedHref, isValid, validationNote, isLastPage }
}

/**
 * Helper function to test Next button click behavior
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @param {Object} buttonData - Button-related data: {nextVisible, nextHref, isLastPage}
 * @param {Object} testContext - Test context: {expectedHref, testUrl}
 * @returns {Promise<{clickResultUrl: string, clickMatches: boolean}>}
 */
async function testNextButtonClick(page, config, buttonData, testContext) {
	const { nextVisible, nextHref, isLastPage } = buttonData
	const { expectedHref, testUrl } = testContext

	let clickResultUrl = "Not tested"
	let clickMatches = false

	if (!config.testClickBehavior) {
		return { clickResultUrl, clickMatches }
	}

	try {
		if (nextVisible && nextHref && nextHref !== "#." && !isLastPage) {
			const baseBeforeClick = page.url()
			await clickPaginationControl(page, config, config.nextTestId)
			clickResultUrl = await waitForUrlAfterListingNav(
				page,
				expectedHref,
				baseBeforeClick,
				25000
			)
			clickMatches = urlMatchesHref(new URL(clickResultUrl), expectedHref, testUrl)
			if (!clickMatches) {
				await page.waitForTimeout(250)
				await clickPaginationControl(page, config, config.nextTestId)
				clickResultUrl = await waitForUrlAfterListingNav(
					page,
					expectedHref,
					baseBeforeClick,
					15000
				)
				clickMatches = urlMatchesHref(new URL(clickResultUrl), expectedHref, testUrl)
			}
		} else {
			clickResultUrl = isLastPage ? "Disabled (last page)" : "Not functional"
			clickMatches = true
		}
	} catch (error) {
		clickResultUrl = `Click failed: ${error.message}`
		clickMatches = false
	}

	return { clickResultUrl, clickMatches }
}

/**
 * Helper function to create single-page result for Next button
 * @returns {Object} Result object for single page scenario
 */
function createSinglePageNextResult() {
	return {
		Button: "Next",
		"Expected Href": "N/A",
		"Actual Href": "Single page",
		"URL After Click": "Single page",
		"Href Valid": "⚠️",
		"Click Matches": "⚠️",
		"Validation Note": "Only 1 page - Next not testable",
	}
}

/**
 * Tests Next button functionality with smart navigation
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @param {number} totalPages - Total number of pages
 * @param {string} originalUrl - Original URL to restore after test
 * @returns {Promise<Object|null>} Test result object or null if button doesn't exist
 */
async function testNextButton(page, config, totalPages, originalUrl) {
	const nextButton = paginationControlLocator(page, config, config.nextTestId)
	const nextButtonExists = (await nextButton.count()) > 0

	if (!nextButtonExists) {
		return null
	}

	if (totalPages <= 1) {
		return createSinglePageNextResult()
	}

	// Check if we're on the last page by checking Next button's href
	const initialNextHref = await nextButton
		.first()
		.getAttribute("href")
		.catch(() => null)
	const isCurrentlyLastPage = initialNextHref === "#."

	// If we're on last page, navigate to page 1 to test Next button functionality
	if (isCurrentlyLastPage) {
		await navigateToPage1ForNextTesting(page, config)
	}

	// Get current URL after potential navigation
	const testUrl = page.url()
	const actualTestPage = parseInt(new URL(testUrl).searchParams.get("page") || "1")

	// Wait for potential server-to-client href conversion (IDs → slugs)
	await page.waitForTimeout(150)

	const nextHref = await nextButton
		.first()
		.getAttribute("href")
		.catch(() => null)
	const nextVisible = await nextButton
		.first()
		.isVisible()
		.catch(() => false)

	// Validate href
	const { expectedHref, isValid, validationNote, isLastPage } = validateNextButtonHref(
		nextHref,
		actualTestPage,
		totalPages,
		testUrl
	)

	// Test click behavior
	const buttonData = { nextVisible, nextHref, isLastPage }
	const testContext = { expectedHref, testUrl }
	const { clickResultUrl, clickMatches } = await testNextButtonClick(
		page,
		config,
		buttonData,
		testContext
	)

	// Navigate back to original URL
	await restoreOriginalUrl(page, config, originalUrl, "Next button test")

	return {
		Button: "Next",
		"Expected Href": expectedHref,
		"Actual Href": nextHref || "null",
		"URL After Click": clickResultUrl,
		"Href Valid": isValid ? "✅" : "❌",
		"Click Matches": clickMatches ? "✅" : "❌",
		"Validation Note": validationNote,
	}
}

/**
 * Helper function to extract and validate page number from button test ID
 * @param {string} testId - Button test ID attribute
 * @param {string} pageButtonPattern - Pattern to match in test ID
 * @returns {number|null} Page number or null if invalid
 */
function extractPageNumber(testId, pageButtonPattern) {
	if (!testId || !testId.includes(pageButtonPattern)) {
		return null
	}

	const pageNumMatch = testId.match(/(\d+)/)
	return pageNumMatch ? parseInt(pageNumMatch[1]) : null
}

/**
 * Helper function to validate page button href
 * @param {number} pageNum - Page number
 * @param {string} pageHref - Button href attribute
 * @param {string} expectedHref - Expected href for comparison
 * @returns {Object} Validation result with isValid and validationNote
 */
function validatePageButtonHref(pageNum, pageHref, expectedHref) {
	// Strict validation - href must match expected href exactly
	const isValid = pageHref === expectedHref
	const validationNote =
		pageNum === 1
			? "Page 1 should omit ?page=1"
			: `Page ${pageNum} should include ?page=${pageNum}`

	return { isValid, validationNote }
}

/**
 * Helper function to validate parameter preservation
 * @param {Object} config - Pagination configuration
 * @param {string} clickResultUrl - URL after click
 * @param {string} originalUrl - Original URL
 * @returns {boolean} Whether parameters are preserved
 */
function validateParameterPreservation(config, clickResultUrl, originalUrl) {
	if (!config.validateParameterPreservation) {
		return false
	}

	const resultUrlObj = new URL(clickResultUrl)
	const originalUrlObj = new URL(originalUrl)

	// Use custom parameter validator if provided
	if (config.customParameterValidator) {
		return config.customParameterValidator(originalUrlObj, resultUrlObj)
	}

	// Default validation: check taxonomy segments preserved in pathname
	const pathPreserved =
		resultUrlObj.pathname.split("/").slice(0, -1).join("/") ===
		originalUrlObj.pathname.split("/").slice(0, -1).join("/")

	// Check ALL query parameters preserved (except 'page' which changes during pagination)
	const originalParams = Array.from(originalUrlObj.searchParams.entries())
	const filtersPreserved = originalParams.every(([param, value]) => {
		if (param === "page") return true // Skip page parameter validation
		const resultValue = resultUrlObj.searchParams.get(param)
		return resultValue === value
	})

	return pathPreserved && filtersPreserved
}

/**
 * Helper function to test individual page button click behavior
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @param {string} testId - data-testid of the page button
 * @param {string} expectedHref - Expected href for validation
 * @param {string} originalUrl - Original URL to restore after test
 * @returns {Promise<Object>} Click test results
 */
async function testPageButtonClick(page, config, testId, expectedHref, originalUrl) {
	let clickResultUrl = "Not tested"
	let clickMatches = false
	let parametersPreserved = false

	if (!config.testClickBehavior) {
		return { clickResultUrl, clickMatches, parametersPreserved }
	}

	try {
		const baseBeforeClick = page.url()
		await clickPaginationControl(page, config, testId)
		clickResultUrl = await waitForUrlAfterListingNav(
			page,
			expectedHref,
			baseBeforeClick,
			25000
		)

		clickMatches = urlMatchesHref(new URL(clickResultUrl), expectedHref, originalUrl)

		// Verify parameters are preserved if validation is enabled
		parametersPreserved = validateParameterPreservation(
			config,
			clickResultUrl,
			originalUrl
		)

		// Restore original state
		await restoreOriginalUrl(page, config, originalUrl, "Page button test")
	} catch (error) {
		clickResultUrl = `Click failed: ${error.message}`
		clickMatches = false
	}

	return { clickResultUrl, clickMatches, parametersPreserved }
}

/**
 * Helper function to create page button test result object
 * @param {number} pageNum - Page number
 * @param {string} expectedHref - Expected href
 * @param {string} pageHref - Actual href
 * @param {Object} clickResults - Click test results
 * @param {Object} hrefValidation - Href validation results
 * @param {Object} config - Pagination configuration
 * @returns {Object} Test result object
 */
function createPageButtonResult(
	pageNum,
	expectedHref,
	pageHref,
	clickResults,
	hrefValidation,
	config
) {
	const { clickResultUrl, clickMatches, parametersPreserved } = clickResults
	const { isValid, validationNote } = hrefValidation

	const resultObject = {
		Button: `Page ${pageNum}`,
		"Expected Href": expectedHref,
		"Actual Href": pageHref,
		"URL After Click": clickResultUrl,
		"Href Valid": isValid ? "✅" : "❌",
		"Click Matches": clickMatches ? "✅" : "❌",
		"Validation Note": validationNote,
	}

	// Add parameter preservation column if enabled
	if (config.validateParameterPreservation && config.testClickBehavior) {
		resultObject["Parameters Preserved"] = parametersPreserved ? "✅" : "❌"
	}

	return resultObject
}

/**
 * Tests page number buttons with parameter preservation validation
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration
 * @param {string} originalUrl - Original URL to restore after tests
 * @returns {Promise<Array>} Array of test result objects
 */
async function testPageButtons(page, config, originalUrl) {
	const results = []
	const pagerContainer = page.locator(`[data-testid="${config.pagerTestId}"]`)

	if (!(await pagerContainer.isVisible())) {
		return results
	}

	const pageNumberButtonsLocator = pagerContainer.locator(
		`[data-testid*="${config.pageButtonPattern}"]`
	)
	let buttonCount = await pageNumberButtonsLocator.count()
	const maxPagesToTest = config.maxPagesToTest
		? Math.min(buttonCount, config.maxPagesToTest)
		: buttonCount

	if (config.enableDetailedLogging) {
		const message = config.maxPagesToTest
			? `📄 Testing first ${maxPagesToTest} of ${buttonCount} pagination buttons`
			: `📄 Testing all ${buttonCount} pagination buttons`
		console.log(message)
	}

	for (let i = 0; i < maxPagesToTest; i++) {
		if (page.isClosed()) {
			break
		}
		await pagerContainer.waitFor({ state: "visible", timeout: 10000 }).catch(() => {})
		buttonCount = await pageNumberButtonsLocator.count()
		if (i >= buttonCount) {
			break
		}

		const pageButton = pageNumberButtonsLocator.nth(i)
		const testId = await pageButton.getAttribute("data-testid")

		// Extract and validate page number
		const pageNum = extractPageNumber(testId, config.pageButtonPattern)
		if (!pageNum) continue

		// Wait for potential server-to-client href conversion (IDs → slugs)
		await page.waitForTimeout(200)

		const pageHref = await pageButton.getAttribute("href")
		const expectedHref = buildExpectedHref(pageNum, originalUrl)

		// Validate href against Pretty Path Rules
		const hrefValidation = validatePageButtonHref(pageNum, pageHref, expectedHref)

		// Test click behavior and parameter preservation if enabled
		const clickResults = await testPageButtonClick(
			page,
			config,
			testId,
			expectedHref,
			originalUrl
		)

		// Create and add result object
		const resultObject = createPageButtonResult(
			pageNum,
			expectedHref,
			pageHref,
			clickResults,
			hrefValidation,
			config
		)
		results.push(resultObject)
	}

	return results
}

/**
 * Helper function to run all pagination button tests
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} fullConfig - Complete pagination configuration
 * @param {number} totalPages - Total number of pages
 * @param {string} originalUrl - Original URL for restoration
 * @returns {Promise<Array>} Array of test results
 */
async function runPaginationButtonTests(page, fullConfig, totalPages, originalUrl) {
	const paginationResults = []

	// Test Previous Button
	const prevResult = await testPreviousButton(page, fullConfig, totalPages, originalUrl)
	if (prevResult) {
		paginationResults.push(prevResult)
	}

	// Short idle only: restoreOriginalUrl already waited for URL stability.
	await waitForListingUrlIdle(page, { stableMs: 200, maxWait: 3000 })

	// Test Next Button
	const nextResult = await testNextButton(page, fullConfig, totalPages, originalUrl)
	if (nextResult) {
		paginationResults.push(nextResult)
	}

	// Test Page Number Buttons
	const pageResults = await testPageButtons(page, fullConfig, originalUrl)
	paginationResults.push(...pageResults)

	return paginationResults
}

/**
 * Helper function to calculate validation summary from test results
 * @param {Array} paginationResults - Array of test result objects
 * @returns {Object} Validation summary with boolean flags
 */
function calculateValidationSummary(paginationResults) {
	const allHrefsValid = paginationResults.every((r) => r["Href Valid"] === "✅")
	const allClicksMatch = paginationResults.every((r) => r["Click Matches"] === "✅")
	const allParametersPreserved = paginationResults.every(
		(r) => !r.hasOwnProperty("Parameters Preserved") || r["Parameters Preserved"] === "✅"
	)

	const validationPassed = allHrefsValid && allClicksMatch && allParametersPreserved

	return { allHrefsValid, allClicksMatch, allParametersPreserved, validationPassed }
}

/**
 * Helper function to display test results and validation summary
 * @param {Object} fullConfig - Complete pagination configuration
 * @param {Array} paginationResults - Array of test result objects
 * @param {Object} validationSummary - Validation summary object
 * @param {number} duration - Test duration in milliseconds
 */
function displayPaginationResults(
	fullConfig,
	paginationResults,
	validationSummary,
	duration
) {
	if (!fullConfig.enableDetailedLogging) {
		return
	}

	// Display results table
	console.log(`\n📊 PAGINATION DETAILED RESULTS TABLE:`)
	console.table(paginationResults)

	// Display validation summary
	const { validationPassed, allHrefsValid, allClicksMatch, allParametersPreserved } =
		validationSummary

	if (validationPassed) {
		console.log(`✅ All pagination buttons respect the Pretty Path Rules`)
	} else {
		console.log(`❌ Some pagination buttons violate Pretty Path Rules`)
		if (!allHrefsValid) console.log(`   - Href validation issues detected`)
		if (!allClicksMatch) console.log(`   - Click behavior doesn't match hrefs`)
		if (!allParametersPreserved)
			console.log(`   - Parameters not preserved during navigation`)
	}

	console.log(`✅ Pagination testing completed in ${duration}ms for current combination`)
}

/**
 * Helper function to handle error scenarios and cleanup
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} fullConfig - Complete pagination configuration
 * @param {string} originalUrl - Original URL for restoration
 * @param {Error} error - The error that occurred
 */
async function handlePaginationTestError(page, fullConfig, originalUrl, error) {
	if (fullConfig.enableDetailedLogging) {
		console.log(`❌ Pagination testing failed: ${error.message}`)
	}

	// Ensure we restore URL even if test fails (skip if browser context closed)
	try {
		if (page && !page.isClosed()) {
			await page.goto(originalUrl)
			await page.waitForTimeout(300)
		}
	} catch (restoreError) {
		// Browser context likely closed - skip restoration gracefully
		if (fullConfig.enableDetailedLogging) {
			console.log(
				`⚠️ Failed to restore URL (browser may be closed): ${restoreError.message}`
			)
		}
	}

	throw error
}

/**
 * Main pagination testing function
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} config - Pagination configuration options
 * @returns {Promise<{tested: boolean, results: Array, summary: Object}>}
 */
export async function testPagination(page, config = {}) {
	const fullConfig = { ...DEFAULT_PAGINATION_CONFIG, ...config }
	const startTime = Date.now()

	// Detect pagination first
	const { hasPagination, buttonCount, totalPages } = await detectPagination(
		page,
		fullConfig
	)

	if (!hasPagination) {
		if (fullConfig.enableDetailedLogging) {
			console.log(`📄 No pagination detected for current combination`)
		}
		return {
			tested: false,
			results: [],
			summary: {
				hasPagination: false,
				buttonCount: 0,
				totalPages: 1,
				testDuration: 0,
			},
		}
	}

	if (fullConfig.enableDetailedLogging) {
		console.log(
			`📄 Pagination detected - testing pagination controls (${buttonCount} buttons found)`
		)
		console.log(`   📊 Pagination info: ${totalPages} total pages detected`)
	}

	// Store current URL for restoration
	const originalUrl = page.url()

	try {
		// Run all pagination button tests
		const paginationResults = await runPaginationButtonTests(
			page,
			fullConfig,
			totalPages,
			originalUrl
		)

		// Calculate validation summary
		const validationSummary = calculateValidationSummary(paginationResults)
		const duration = Date.now() - startTime

		// Display results and summary
		displayPaginationResults(fullConfig, paginationResults, validationSummary, duration)

		// Final restore to original URL
		await restoreOriginalUrl(
			page,
			fullConfig,
			originalUrl,
			"Final pagination test cleanup"
		)

		return {
			tested: true,
			results: paginationResults,
			summary: {
				hasPagination: true,
				buttonCount,
				totalPages,
				testDuration: duration,
				...validationSummary,
			},
		}
	} catch (error) {
		await handlePaginationTestError(page, fullConfig, originalUrl, error)
	}
}
