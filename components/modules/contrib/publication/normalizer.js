import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const normalizeNodes = (nodes) => {
	return nodes.map((node) => ({
		id: node.drupal_internal__nid,
		title: get(node, "title", null),
		image: get(node, "field_vactory_media.thumbnail", null),
		excerpt: truncate(stripHtml(get(node, "field_vactory_excerpt.processed", "")), 100),
		date: get(node, "field_vactory_date", null),
		document: get(
			node,
			"field_vactory_media_document.field_media_file.uri.value._default",
			null
		),
		tags: get(node, "field_vactory_tags", [])
			.map((term) => term.name)
			.filter((t) => typeof t !== "undefined"),
	}))
}
