/**
 * COOKIE COMPLIANCE TEST
 * 
 * Purpose:
 * - Validates that Cookie Compliance layer functions correctly
 * - Ensures cookie consent is properly stored and retrieved
 * - Tests both Accept and Decline functionality
 * 
 * Test Process:
 * 1. Tests cookie layer appears when no cookie is set
 * 2. Tests "Accept" button sets correct cookie values
 * 3. Tests "Decline" button sets correct cookie values
 * 4. Tests cookie layer doesn't appear after consent is given
 * 5. Tests cookie persistence across page reloads
 * 
 * Expected Results:
 * ✅ Success: Cookie layer behavior matches expected consent flow
 * ❌ Failure: Cookie values don't match expected or layer appears incorrectly
 * 
 * Prerequisites:
 * - Cookie compliance component must be enabled and visible on homepage
 * - Both Accept and Decline buttons must be functional
 */

import { test, expect } from "@playwright/test"

const COOKIE_NAME = "CookieConsent"

// Helper function to get cookie domain from baseURL
const getCookieDomain = (baseURL) => {
	if (!baseURL) return 'localhost'
	try {
		const url = new URL(baseURL)
		return url.hostname
	} catch (e) {
		console.warn("Failed to parse baseURL for cookie domain:", e.message)
		return 'localhost'
	}
}

// Helper function to parse cookie value
const parseCookieValue = (cookieValue) => {
	try {
		// URL decode the cookie value first
		const decodedValue = decodeURIComponent(cookieValue)
		return JSON.parse(decodedValue)
	} catch (e) {
		console.warn("Failed to parse cookie value:", e.message)
		return null
	}
}

// Helper function to clear cookies before test
const clearCookieConsent = async (context) => {
	await context.clearCookies({ name: COOKIE_NAME })
}

test.describe("Cookie Compliance Tests", () => {
	test("should display cookie layer when no cookie is set", async ({ page, context }) => {
		// 1. Clear any existing cookie consent
		await clearCookieConsent(context)
		
		console.log("🔍 Testing: Cookie layer visibility when no cookie is set")
		
		// 2. Visit the app
		await page.goto("/")
		await page.waitForLoadState("networkidle")
		await page.waitForTimeout(2000)
		
		// 3. Check if cookie layer is visible
		const cookieLayer = page.getByTestId("cookie-layer")
		
		await expect(cookieLayer).toBeVisible({ timeout: 5000 })
		console.log("✅ Cookie compliance layer is visible when no cookie is set")
	})

	test("should set correct cookie values when clicking Accept", async ({ page, context }) => {
		// 1. Clear any existing cookie consent
		await clearCookieConsent(context)
		
		console.log("🔍 Testing: Accept button sets correct cookie values")
		
		// 2. Visit the app
		await page.goto("/")
		await page.waitForLoadState("networkidle")
		await page.waitForTimeout(2000)
		
		// 3. Find and click Accept button
		const acceptButton = page.getByTestId("cookie-accept-button").first()
		const acceptButtonFallback = page.locator('button:has-text("Accept"), button:has-text("Accepter")').first()
		
		try {
			await acceptButton.waitFor({ state: 'visible', timeout: 5000 })
			await acceptButton.click()
			console.log("✅ Clicked Accept button (test-id)")
		} catch (error) {
			console.warn("Primary accept button not found, trying fallback:", error.message)
			try {
				await acceptButtonFallback.waitFor({ state: 'visible', timeout: 2000 })
				await acceptButtonFallback.click()
				console.log("✅ Clicked Accept button (fallback)")
			} catch (fallbackError) {
				console.error("Both accept button attempts failed:", fallbackError.message)
				throw new Error("❌ Could not find or click Accept button")
			}
		}
		
		// 4. Wait for cookie to be set
		await page.waitForTimeout(1000)
		
		// 5. Check cookie value
		const cookies = await context.cookies()
		const consentCookie = cookies.find(cookie => cookie.name === COOKIE_NAME)
		
		if (!consentCookie) {
			throw new Error("❌ CookieConsent cookie not set after clicking Accept")
		}
		
		const cookieData = parseCookieValue(consentCookie.value)
		
		if (!cookieData) {
			throw new Error(`❌ CookieConsent cookie value is not valid JSON. Raw value: ${JSON.stringify(consentCookie.value)}`)
		}
		
		// 6. Verify cookie contains expected values for Accept
		const expectedAcceptValues = {
			necessary: true,
			analytics: true,
			marketing: true,
			preferences: true
		}
		
		const cookieMatches = Object.keys(expectedAcceptValues).every(
			key => cookieData[key] === expectedAcceptValues[key]
		)
		
		if (!cookieMatches) {
			throw new Error(`❌ Cookie values don't match expected Accept values:
  Expected: ${JSON.stringify(expectedAcceptValues, null, 2)}
  Actual: ${JSON.stringify(cookieData, null, 2)}`)
		}
		
		console.log("✅ Accept button set correct cookie values:", JSON.stringify(cookieData))
	})

	test("should set correct cookie values when clicking Decline", async ({ page, context }) => {
		// 1. Clear any existing cookie consent
		await clearCookieConsent(context)
		
		console.log("🔍 Testing: Decline button sets correct cookie values")
		
		// 2. Visit the app
		await page.goto("/")
		await page.waitForLoadState("networkidle")
		await page.waitForTimeout(2000)
		
		// 3. Find and click Decline button
		const declineButton = page.getByTestId("cookie-decline-button").first()
		const declineButtonFallback = page.locator('button:has-text("Decline"), button:has-text("Refuser"), button[aria-label="close-cookie-layer"]').first()
		
		try {
			await declineButton.waitFor({ state: 'visible', timeout: 5000 })
			await declineButton.click()
			console.log("✅ Clicked Decline button (test-id)")
		} catch (error) {
			console.warn("Primary decline button not found, trying fallback:", error.message)
			try {
				await declineButtonFallback.waitFor({ state: 'visible', timeout: 2000 })
				await declineButtonFallback.click()
				console.log("✅ Clicked Decline button (fallback)")
			} catch (fallbackError) {
				console.error("Both decline button attempts failed:", fallbackError.message)
				throw new Error("❌ Could not find or click Decline button")
			}
		}
		
		// 4. Wait for cookie to be set
		await page.waitForTimeout(1000)
		
		// 5. Check cookie value
		const cookies = await context.cookies()
		const consentCookie = cookies.find(cookie => cookie.name === COOKIE_NAME)
		
		if (!consentCookie) {
			throw new Error("❌ CookieConsent cookie not set after clicking Decline")
		}
		
		const cookieData = parseCookieValue(consentCookie.value)
		
		if (!cookieData) {
			throw new Error(`❌ CookieConsent cookie value is not valid JSON. Raw value: ${JSON.stringify(consentCookie.value)}`)
		}
		
		// 6. Verify cookie contains expected values for Decline
		const expectedDeclineValues = {
			necessary: true,
			analytics: false,
			marketing: false,
			preferences: false
		}
		
		const cookieMatches = Object.keys(expectedDeclineValues).every(
			key => cookieData[key] === expectedDeclineValues[key]
		)
		
		if (!cookieMatches) {
			throw new Error(`❌ Cookie values don't match expected Decline values:
  Expected: ${JSON.stringify(expectedDeclineValues, null, 2)}
  Actual: ${JSON.stringify(cookieData, null, 2)}`)
		}
		
		console.log("✅ Decline button set correct cookie values:", JSON.stringify(cookieData))
	})

	test("should NOT display cookie layer when cookie is already set (Accept)", async ({ page, context }) => {
		// 1. Pre-set cookie with Accept values
		const baseURL = process.env.NEXT_BASE_URL || "http://localhost:3000"
		await context.addCookies([{
			name: COOKIE_NAME,
			value: JSON.stringify({
				necessary: true,
				analytics: true,
				marketing: true,
				preferences: true
			}),
			domain: getCookieDomain(baseURL),
			path: '/'
		}])
		
		console.log("🔍 Testing: Cookie layer hidden when Accept cookie exists")
		
		// 2. Visit the app
		await page.goto("/")
		await page.waitForLoadState("networkidle")
		await page.waitForTimeout(3000)
		
		// 3. Verify cookie layer is NOT visible
		const cookieLayer = page.getByTestId("cookie-layer")
		
		try {
			await expect(cookieLayer).not.toBeVisible({ timeout: 2000 })
			console.log("✅ Cookie layer correctly hidden when Accept cookie exists")
		} catch (error) {
			console.error("Cookie layer visibility check failed:", error.message)
			throw new Error("❌ Cookie layer is visible even though Accept cookie is set")
		}
	})

	test("should NOT display cookie layer when cookie is already set (Decline)", async ({ page, context }) => {
		// 1. Pre-set cookie with Decline values
		const baseURL = process.env.NEXT_BASE_URL || "http://localhost:3000"
		await context.addCookies([{
			name: COOKIE_NAME,
			value: JSON.stringify({
				necessary: true,
				analytics: false,
				marketing: false,
				preferences: false
			}),
			domain: getCookieDomain(baseURL),
			path: '/'
		}])
		
		console.log("🔍 Testing: Cookie layer hidden when Decline cookie exists")
		
		// 2. Visit the app
		await page.goto("/")
		await page.waitForLoadState("networkidle")
		await page.waitForTimeout(3000)
		
		// 3. Verify cookie layer is NOT visible
		const cookieLayer = page.getByTestId("cookie-layer")
		
		try {
			await expect(cookieLayer).not.toBeVisible({ timeout: 2000 })
			console.log("✅ Cookie layer correctly hidden when Decline cookie exists")
		} catch (error) {
			console.error("Cookie layer visibility check failed:", error.message)
			throw new Error("❌ Cookie layer is visible even though Decline cookie is set")
		}
	})

	test("should persist cookie choice across page reloads", async ({ page, context }) => {
		// 1. Clear any existing cookie consent
		await clearCookieConsent(context)
		
		console.log("🔍 Testing: Cookie persistence across page reloads")
		
		// 2. Visit the app and accept cookies
		await page.goto("/")
		await page.waitForLoadState("networkidle")
		await page.waitForTimeout(2000)
		
		// 3. Accept cookies
		const acceptButton = page.getByTestId("cookie-accept-button").first()
		const acceptButtonFallback = page.locator('button:has-text("Accept"), button:has-text("Accepter")').first()
		
		try {
			await acceptButton.waitFor({ state: 'visible', timeout: 5000 })
			await acceptButton.click()
		} catch (error) {
			console.warn("Primary accept button not found, using fallback:", error.message)
			await acceptButtonFallback.waitFor({ state: 'visible', timeout: 2000 })
			await acceptButtonFallback.click()
		}
		
		await page.waitForTimeout(1000)
		
		// 4. Reload the page
		await page.reload()
		await page.waitForLoadState("networkidle")
		await page.waitForTimeout(3000)
		
		// 5. Verify cookie layer is still NOT visible after reload
		const cookieLayerAfterReload = page.getByTestId("cookie-layer")
		
		try {
			await expect(cookieLayerAfterReload).not.toBeVisible({ timeout: 2000 })
			console.log("✅ Cookie choice persisted across page reload")
		} catch (error) {
			console.error("Cookie persistence check failed:", error.message)
			throw new Error("❌ Cookie layer reappeared after page reload - cookie choice not persisted")
		}
		
		// 6. Verify cookie still exists with correct values
		const cookies = await context.cookies()
		const consentCookie = cookies.find(cookie => cookie.name === COOKIE_NAME)
		
		if (!consentCookie) {
			throw new Error("❌ CookieConsent cookie lost after page reload")
		}
		
		const cookieData = parseCookieValue(consentCookie.value)
		if (!cookieData || !cookieData.necessary) {
			throw new Error(`❌ CookieConsent cookie data corrupted after page reload. Raw value: ${JSON.stringify(consentCookie.value)}`)
		}
		
		console.log("✅ Cookie data preserved after reload:", JSON.stringify(cookieData))
	})
})
