import get from "lodash.get"

export const normalizeNodes = (data) => {
	return {
		count: get(data, "components.[0].collection.data.meta.count"),
		showNotifications: !!get(data, "components.[0].show_notification"),
		url: get(data, "components.0.link.url", "#!"),
	}
}
