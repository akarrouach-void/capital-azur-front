import { Button, Icon } from "@/ui"
import React from "react"
import { normalizeNodes } from "./normalizer"

export const config = {
	id: "vactory_notifications_df:notification_icon",
}

function BadgeIconContainer({ data }) {
	const { count, url } = normalizeNodes(data)

	return (
		<Button
			outline
			href={url}
			className="hover:none fixed bottom-2 left-2 z-30 flex items-center justify-center rounded-full border border-primary-500 bg-transparent p-3 backdrop-blur-sm backdrop-filter hover:bg-transparent"
		>
			<div className="relative h-full w-full">
				<p className="absolute -right-3 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-primary-500">
					<span>{count}</span>
				</p>
				<Icon id="youtube" className="h-10 w-10 text-primary-400" />
			</div>
		</Button>
	)
}

export default BadgeIconContainer
