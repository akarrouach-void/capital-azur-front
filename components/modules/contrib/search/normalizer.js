import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const normalizeNodes = (nodes) => {
	return (
		nodes?.map((post) => {
			return normalizeNode(post)
		}) || []
	)
}

export const normalizeNode = (node) => {
	return {
		nid: node?.attributes?.drupal_internal__nid,
		title: get(node, "attributes.title", null),
		excerpt: truncate(
			stripHtml(get(node, "attributes.field_vactory_excerpt.processed", "")),
			100
		),
		body: get(node, "attributes.body.processed", null),
		url: get(node, "attributes.path.alias", "#."),
		date: get(node, "attributes.field_vactory_date", null),
	}
}
