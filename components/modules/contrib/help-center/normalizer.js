import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const normalizeNodes = (nodes) => {
	return nodes.map((post) => ({
		id: post.drupal_internal__nid,
		title: post.title,
		url: get(post, "path.alias", "#."),
		description: truncate(stripHtml(get(post, "body.processed", "")), 100),
		section: post?.field_section?.name,
	}))
}
