/**
 * METATAGS VALIDATION TEST
 * 
 * Purpose:
 * - Validates essential SEO and metatags presence and content
 * - Ensures proper Open Graph tags for social sharing functionality
 * 
 * Test Process:
 * 1. Navigates to homepage and handles overlays
 * 2. Checks essential metatags presence in DOM
 * 3. Validates each tag has content
 * 4. Reports content found for each tag
 * 5. Lists failed vs successful tag validations
 * 
 * Tags Validated:
 * - Title (page title)
 * - Description (meta description for search results)
 * - OG Title, OG Description, OG Image, OG URL (social sharing)
 * - Viewport (mobile responsiveness)
 * - Canonical URL
 * 
 * Expected Results:
 * ✅ Success: "🚀 All metatags validated: Title, Description, OG Title..."
 * ❌ Failure: Lists missing or empty tags for fixing
 */

import { test, expect } from "@playwright/test"
import { handleOverlays } from "./utils/overlay-handler.js"

test("Metatags presence and content", async ({ page }) => {
	await page.goto("/")
	await page.waitForLoadState("networkidle")
	await page.waitForTimeout(2000)
	await handleOverlays(page)

	const metatags = [
		{ selector: "title", name: "Title" },
		{ selector: 'meta[name="description"]', name: "Description", attribute: "content" },
		{ selector: 'meta[property="og:title"]', name: "OG Title", attribute: "content" },
		{
			selector: 'meta[property="og:description"]',
			name: "OG Description",
			attribute: "content",
		},
		{ selector: 'meta[name="viewport"]', name: "Viewport", attribute: "content" },
		{ selector: 'meta[property="og:image"]', name: "OG Image", attribute: "content" },
		{ selector: 'meta[property="og:url"]', name: "OG URL", attribute: "content" },
		{ selector: 'link[rel="canonical"]', name: "Canonical URL", attribute: "href" },
	]

	const successfulTags = []
	const failedTags = []

	for (const tag of metatags) {
		console.log(`🔍 Checking ${tag.name}`)

		const element = page.locator(tag.selector).first()
		const exists = (await element.count()) > 0

		if (!exists) {
			console.log(`❌ ${tag.name} not found`)
			failedTags.push(tag.name)
			continue
		}

		// Get content (either textContent for title or attribute value for meta tags)
		const content = tag.attribute
			? await element.getAttribute(tag.attribute)
			: await element.textContent()

		if (!content || content.trim().length === 0) {
			console.log(`❌ ${tag.name} is empty`)
			failedTags.push(tag.name)
			continue
		}

		console.log(`✅ ${tag.name}: "${content.trim()}"`)
		successfulTags.push(tag.name)
	}

	if (failedTags.length === 0) {
		console.log(`🚀 All metatags validated: ${successfulTags.join(", ")}`)
	} else {
		console.log(
			`❌ Failed: ${failedTags.join(", ")} | ✅ Passed: ${successfulTags.join(", ")}`
		)
		throw new Error(`Metatag validation failed: ${failedTags.join(", ")}`)
	}
})
