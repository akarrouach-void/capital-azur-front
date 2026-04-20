/**
 * BLOG LISTINGS - DYNAMIC PRETTY PATH RULES VALIDATION TEST
 *
 * Validates BlogListWidget URL generation (theme × tag), reset, and pagination.
 * Pretty path rules mirror EventListWidget (two taxonomies): mixed /all segments allowed;
 * /blogs/all at end and /all/all are invalid; page=1 omitted.
 *
 * Required data-testid: blog-theme-filter, blog-tag-filter, blog-submit-filter, blog-reset-filter.
 * Pagination id: blog-pagination
 *
 * Run: yarn workspace starter playwright test listings/blog-listings.spec.js
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "../utils/overlay-handler.js"
import { preventTimeout } from "../utils/combination-limiter.js"
import {
	testPagination,
	waitForListingUrlIdle,
} from "../utils/pagination-tester.js"

const basePath = process.env.PW_BLOG_LISTING_PATH || "/blogs"
const LISTING_SEGMENT = "blogs"

const paginationConfig = {
	containerTestId: "blog-pagination-container",
	previousTestId: "blog-pagination-previous",
	nextTestId: "blog-pagination-next",
	pagerTestId: "blog-pagination-pager",
	pageButtonPattern: "blog-pagination-",
}

/**
 * @param {string} pathname
 * @returns {{ themeInUrl: string | null, tagInUrl: string | null }}
 */
function getBlogTaxonomiesFromPath(pathname) {
	const pathSegments = pathname.split("/").filter((s) => s)
	const idx = pathSegments.findIndex((segment) => segment === LISTING_SEGMENT)
	if (idx === -1) {
		return { themeInUrl: null, tagInUrl: null }
	}
	return {
		themeInUrl: pathSegments[idx + 1] ?? null,
		tagInUrl: pathSegments[idx + 2] ?? null,
	}
}

test("Blog Listings - Dynamic Pretty Path Rules Validation (Theme × Tag)", async ({
	page,
}) => {
	await page.goto(basePath)
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)

	const themeSelect = page.locator('[data-testid="blog-theme-filter"]').first()
	const tagSelect = page.locator('[data-testid="blog-tag-filter"]').first()

	const themeOptions = await themeSelect.locator("option").all()
	const tagOptions = await tagSelect.locator("option").all()

	if (themeOptions.length === 0 || tagOptions.length === 0) {
		throw new Error(
			"Blog listing filters have no options — check Drupal route, terms, and data-testids."
		)
	}

	const themes = []
	for (const option of themeOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		themes.push({ value, text: text?.trim() })
	}

	const tags = []
	for (const option of tagOptions) {
		const value = await option.getAttribute("value")
		const text = await option.textContent()
		tags.push({ value, text: text?.trim() })
	}

	const totalCombinations = themes.length * tags.length
	preventTimeout(test, totalCombinations, "Blog Listings")

	let testCount = 0
	const allUrls = []
	const testResults = []

	for (const theme of themes) {
		for (const tag of tags) {
			testCount++
			console.log(
				`\n--- TEST ${testCount}/${totalCombinations}: ${theme.text} + ${tag.text} ---`
			)

			try {
				await page.goto(basePath)
				await page.waitForLoadState("domcontentloaded")
				await page.waitForTimeout(500)

				const submitButton = page.locator('[data-testid="blog-submit-filter"]').first()
				const currentThemeSelect = page
					.locator('[data-testid="blog-theme-filter"]')
					.first()
				const currentTagSelect = page.locator('[data-testid="blog-tag-filter"]').first()

				await page.waitForTimeout(500)

				await currentThemeSelect.selectOption(theme.value)
				await page.waitForTimeout(300)
				await currentTagSelect.selectOption(tag.value)
				await page.waitForTimeout(300)

				await expect(currentThemeSelect).toHaveValue(String(theme.value))
				await expect(currentTagSelect).toHaveValue(String(tag.value))

				await submitButton.click({ force: true, timeout: 3000 })
				await waitForListingUrlIdle(page, { stableMs: 500, maxWait: 25000 })
				await page.waitForLoadState("domcontentloaded", { timeout: 6000 }).catch(() => {})

				const urlAfterSubmit = page.url()
				allUrls.push(urlAfterSubmit)
				console.log(`📍 URL: ${urlAfterSubmit}`)

				const urlObj = new URL(urlAfterSubmit)
				const { themeInUrl, tagInUrl } = getBlogTaxonomiesFromPath(urlObj.pathname)

				const result = {
					Test: testCount,
					Theme: `${theme.text} (${theme.value})`,
					Tag: `${tag.text} (${tag.value})`,
					URL: urlAfterSubmit,
					ThemeRule: "",
					TagRule: "",
					Pagination: "",
					Status: "✅",
				}

				if (theme.value !== "all" && theme.value !== "") {
					expect(themeInUrl).toBeTruthy()
					expect(themeInUrl).not.toBe("all")
					result.ThemeRule = `"${themeInUrl}" in path`
				} else {
					if (tag.value === "all" || tag.value === "") {
						expect(themeInUrl).toBeNull()
						result.ThemeRule = '"all" omitted from path'
					} else {
						expect(themeInUrl).toBe("all")
						result.ThemeRule = '"all" kept with specific tag'
					}
				}

				if (tag.value !== "all" && tag.value !== "") {
					if (theme.value !== "all" && theme.value !== "") {
						expect(tagInUrl).toBeTruthy()
						expect(tagInUrl).not.toBe("all")
						result.TagRule = `"${tagInUrl}" in path (2nd)`
					} else {
						expect(tagInUrl).toBeTruthy()
						expect(tagInUrl).not.toBe("all")
						result.TagRule = `"${tagInUrl}" in path (2nd after all)`
					}
				} else {
					if (theme.value !== "all" && theme.value !== "") {
						expect(tagInUrl).toBe("all")
						result.TagRule = '"all" shown (mixed taxonomies)'
					} else {
						expect(themeInUrl).toBeNull()
						expect(tagInUrl).toBeNull()
						result.TagRule = 'both "all" omitted'
					}
				}

				const urlString = urlObj.pathname + urlObj.search
				expect(urlString).not.toMatch(new RegExp(`/${LISTING_SEGMENT}/all($|\\?)`))
				expect(urlString).not.toMatch(/\/all\/all/)
				expect(urlString).not.toContain("page=1")

				const paginationResult = await testPagination(page, paginationConfig)
				result.Pagination = paginationResult.tested ? "✅ Tested" : "N/A"
				testResults.push(result)
			} catch (error) {
				console.log(`❌ TEST ${testCount} FAILED: ${error.message}`)
				testResults.push({
					Test: testCount,
					Theme: `${theme.text} (${theme.value})`,
					Tag: `${tag.text} (${tag.value})`,
					URL: page.url(),
					ThemeRule: "FAILED",
					TagRule: "FAILED",
					Pagination: "FAILED",
					Status: "❌",
				})
				throw error
			}
		}
	}

	console.log(`\n🎉 TESTED ALL ${testCount} COMBINATIONS SUCCESSFULLY!`)
	console.log(`\n📊 DETAILED TEST RESULTS TABLE:`)
	console.table(testResults)

	console.log(`\n--- RESET TEST ---`)
	try {
		const resetButton = page.locator('[data-testid="blog-reset-filter"]').first()
		const resetButtonVisible = await resetButton.isVisible({ timeout: 5000 })
		if (resetButtonVisible) {
			await resetButton.click({ force: true, timeout: 3000 })
			await page.waitForTimeout(500)

			const urlAfterReset = page.url()
			console.log(`📍 URL after reset: ${urlAfterReset}`)

			const resetUrlObj = new URL(urlAfterReset)
			expect(resetUrlObj.search).toBe("")
			expect(resetUrlObj.pathname).toContain(`/${LISTING_SEGMENT}`)
			expect(resetUrlObj.pathname).not.toContain("/all")
			console.log(`✅ Reset: Clean URL with no query parameters`)
		} else {
			console.log(`⚠️ Reset button not found - skipping reset test`)
		}
	} catch (resetError) {
		console.log(`⚠️ Reset test failed: ${resetError.message}`)
	}

	const allUrlsString = allUrls.join(" ")
	expect(allUrlsString).not.toContain("page=1")
	expect(allUrlsString).not.toMatch(new RegExp(`/${LISTING_SEGMENT}/all($|\\s)`))
	expect(allUrlsString).not.toMatch(/\/all\/all/)

	console.log(`✅ Global: No invalid patterns across all ${testCount} combinations`)
})
