/**
 * COMBINATION LIMITER - Simple timeout prevention for combination tests
 *
 * This utility automatically calculates and sets appropriate test timeouts
 * based on the number of combinations, so you never have to worry about timeouts again.
 *
 * Usage:
 * ```javascript
 * import { preventTimeout } from "./utils/combination-limiter.js"
 *
 * // Calculate combinations
 * const totalCombinations = themes.length * cities.length * sorts.length
 *
 * // Automatically prevent timeouts (handles all the complex timeout calculation internally)
 * preventTimeout(test, totalCombinations, "Events Listings")
 * ```
 *
 * That's it! No need to worry about timeouts, buffers, limits, or complex configuration.
 */

/**
 * Automatically prevents test timeouts by setting appropriate timeout based on combination count
 * @param {Object} testInstance - Playwright test instance
 * @param {number} totalCombinations - Total number of combinations to test
 * @param {string} [testName="Combination Test"] - Test name for logging
 */
export function preventTimeout(
	testInstance,
	totalCombinations,
	testName = "Combination Test"
) {
	// Validate required parameters
	if (!testInstance || typeof testInstance.setTimeout !== "function") {
		throw new Error("testInstance must be a valid Playwright test instance")
	}
	if (!totalCombinations || totalCombinations <= 0) {
		throw new Error("totalCombinations must be a positive number")
	}

	// Calculate smart timeout based on combination count
	// Base calculation: 8 seconds per combination + buffers
	const timePerCombination = 8000 // 8 seconds per combination
	const baseBuffer = 15000 // 15 seconds base buffer
	const extraBuffer = totalCombinations * 2000 // 2 seconds extra per combination

	const calculatedTimeout =
		totalCombinations * timePerCombination + baseBuffer + extraBuffer

	// Apply reasonable limits (1 minute minimum, 10 minutes maximum)
	const finalTimeout = Math.max(60000, Math.min(600000, calculatedTimeout))

	// Set the timeout
	testInstance.setTimeout(finalTimeout)

	// Simple logging
	console.log(`🎯 ${testName.toUpperCase()}: ${totalCombinations} combinations`)
	console.log(`⏱️  Auto timeout: ${Math.round(finalTimeout / 1000)}s`)
}
