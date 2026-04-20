const { createNextConfig } = require("@vactorynext/core/config")

module.exports = createNextConfig({
	// Disable PWA
	disablePWA: false,
	headers: [
		// Add any other custom headers here
	],
	// And general Next.js config
	next: {
		// Any next.config.js specific options
	},
})
