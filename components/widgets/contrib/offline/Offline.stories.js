import React from "react"
import { OfflineDetector } from "./Offline"
import { PlaceholderSections } from "@vactorynext/core/storybook-client"

export const Default = () => {
	return (
		<div className="relative">
			<PlaceholderSections />
			<OfflineDetector />
		</div>
	)
}

// eslint-disable-next-line
export default {
	title: "Components/Offline Status",
}
