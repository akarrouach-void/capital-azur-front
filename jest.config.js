const nextJest = require("next/jest")

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
})

// Add any custom config to be passed to Jest
const config = {
	// Add more setup options before each test is run
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

	// Optional: Add test environment configuration
	testEnvironment: "jest-environment-jsdom",

	// Configure fake timers globally to avoid warnings
	fakeTimers: {
		enableGlobally: true,
	},

	// Async timeout increased to avoid timeouts
	testTimeout: 10000,

	// Force Jest to exit after tests complete
	forceExit: true,

	// Exclude Playwright tests from Jest (top-level tests/ directory only)
	testPathIgnorePatterns: [
		"/node_modules/",
		"/.next/",
		"<rootDir>/tests/", // Exclude Playwright tests in top-level tests/ directory
	],

	// Only run Jest tests (excluding .spec.js files which are Playwright tests)
	testMatch: [
		"**/*.test.[jt]s?(x)", // Match .test.js but not .spec.js
	],

	// Optional: Add coverage configuration
	collectCoverageFrom: [
		"components/**/*.{js,jsx,ts,tsx}",
		"!**/*.d.ts",
		"!**/node_modules/**",
	],

	moduleNameMapper: {
		"^@/ui(.*)$": "<rootDir>/components/ui$1", // Adjust this path based on your actual UI components location
	},
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)
