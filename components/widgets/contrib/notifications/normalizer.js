import get from "lodash.get"

export function normalizeNotifications(nodes) {
	return nodes?.map((node) => ({
		id: node.id,
		title: node.name,
		content: node.notification_message,
		views: node.notification_viewers,
		concernedUsers: node.notification_concerned_users,
		createdAt: node.created,
		owner: {
			username: get(node, "user_id.display_name"),
			name: get(node, "user_id.name"),
			avatar: get(node, "user_id.user_picture.uri"),
		},
		pageUrl: get(node, "notification_related_content.path.alias"),
	}))
}
