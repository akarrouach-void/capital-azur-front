import React from "react"
import { BackToTop } from "./BackToTop"
import BackToTopCode from "!!raw-loader!./BackToTop"
import { PlaceholderSections } from "@vactorynext/core/storybook-client"

export const Default = () => {
	return (
		<div className="relative">
			<PlaceholderSections />
			<BackToTop />
		</div>
	)
}

// eslint-disable-next-line
export default {
	title: "Components/Go To Top",
	parameters: {
		componentSource: {
			code: BackToTopCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
				Description :
				BackToTop component for quickly scrolling to the top of the page.
				`,
			},
		},
	},
}
