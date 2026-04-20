import { SharedPreview } from "@vactorynext/core/storybook-client"
import "../styles/globals.css"

export const parameters = {
	...SharedPreview.parameters,
	// Add or override any parameters specific to the app
}

export const decorators = [
	...SharedPreview.decorators,
	// Add any app-specific decorators if needed
]
