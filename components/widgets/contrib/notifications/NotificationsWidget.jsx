import { EmptyBlock } from "@/ui"
import { useCollectionContext } from "@vactorynext/core/hooks"
import React from "react"
import { normalizeNotifications } from "./normalizer"
import { Notifications } from "./Notifications"

export const config = {
	id: "vactory_notifications_df:notifications",
}

function NotificationsContainer({ data }) {
	const collectionData = useCollectionContext(data)
	if (collectionData?.nodes?.length == 0) {
		return <EmptyBlock />
	}

	return <Notifications notifications={normalizeNotifications(collectionData.nodes)} />
}

export default NotificationsContainer
