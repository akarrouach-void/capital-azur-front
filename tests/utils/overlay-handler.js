/**
 * OVERLAY HANDLER - Closes modals/overlays that block test interactions
 *
 * Usage: import { handleOverlays } from "./utils/overlay-handler.js"
 * Call before interactions: await handleOverlays(page)
 *
 * Adding new overlays:
 * 1. Add selector to overlaySelectors array below
 * 2. Use aria-modal="true" on overlay containers
 * 3. Use data-testid="close-*" on close buttons
 */

/**
 * Attempts to close an overlay by trying different close button patterns
 * @param {Object} overlay - The overlay locator
 * @returns {Promise<boolean>} True if overlay was successfully closed
 */
async function tryCloseOverlayButtons(overlay) {
	const closeButtons = [
		overlay.locator('[aria-label*="close"]'),
		// Add more close button patterns here if needed:
	]

	for (const closeBtn of closeButtons) {
		try {
			if (await closeBtn.isVisible({ timeout: 500 })) {
				await closeBtn.click({ timeout: 1000 })
				console.log("[OVERLAY/MODALS] ✅ Closed overlay")
				await closeBtn.page().waitForTimeout(500)
				return true
			}
		} catch (error) {
			// Continue to next close button - this is expected behavior for non-interactive elements
			console.debug("[OVERLAY/MODALS] Close button not interactive:", error.message)
		}
	}

	return false
}

/**
 * Handles a single overlay by checking if it's visible and trying to close it
 * @param {Object} page - Playwright page object
 * @param {string} selector - CSS selector for the overlay
 * @returns {Promise<boolean>} True if overlay was found and handled
 */
async function handleSingleOverlay(page, selector) {
	try {
		const overlay = page.locator(selector).first()
		if (await overlay.isVisible({ timeout: 1000 })) {
			return await tryCloseOverlayButtons(overlay)
		}
	} catch (error) {
		// Continue to next overlay type - this is expected when overlay doesn't exist
		console.debug(
			"[OVERLAY/MODALS] Overlay not found or not accessible:",
			selector,
			error.message
		)
	}

	return false
}

/**
 * Uses Escape key to close any remaining overlays
 * @param {Object} page - Playwright page object
 */
async function tryEscapeKeyFallback(page) {
	try {
		await page.keyboard.press("Escape")
		await page.waitForTimeout(500)
		await page.keyboard.press("Escape") // Double escape for nested modals
		await page.waitForTimeout(500)
	} catch (error) {
		// Escape didn't work - this is expected when page context is not available or focused
		console.debug("[OVERLAY/MODALS] Escape key fallback failed:", error.message)
	}
}

// Helper function to handle overlays and modal dialogs
export async function handleOverlays(page) {
	console.log("[OVERLAY/MODALS] 🔧 Checking for overlays and modals...")

	// Add new overlay selectors here when creating new modals/overlays
	const overlaySelectors = [
		'[role="dialog"]',
		'[aria-modal="true"]', // Preferred for new modals
		".reactour__mask",
		".reactour__popover",
		// Add new selectors here:
		// '[data-testid="your-modal"]',
	]

	// Try to close overlays using their close buttons
	for (const selector of overlaySelectors) {
		await handleSingleOverlay(page, selector)
	}

	// Fallback: try pressing Escape key to close any remaining overlays
	await tryEscapeKeyFallback(page)
}
