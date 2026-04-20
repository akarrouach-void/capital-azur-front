import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const normalizeNodes = (nodes) => {
	return nodes.map((post) => ({
		id: post.drupal_internal__nid,
		title: post.title,
		url: get(post, "path.alias", "#."),
		excerpt: truncate(stripHtml(get(post, "field_vactory_excerpt.processed", "")), 100),
		profile: get(post, "field_vactory_profils.name", null),
		image: get(post, "field_vactory_media.thumbnail", null),
		date: post.field_vactory_date,
		role: post.field_vactory_role,
		address: post.field_vactory_address,
		hasFlag: post?.has_flag,
		isFlagged: post?.is_flagged,
	}))
}

export const normalizeNode = (node) => {
	return {
		id: node?.drupal_internal__nid,
		title: get(node, "title", null),
		image: get(node, "field_vactory_media.thumbnail", null),
		category: get(node, "field_vactory_profils.name", null),
		date: get(node, "field_vactory_date", null),
		excerpt: get(node, "field_vactory_excerpt.value", null),
		body: get(node, "body.processed", null),
		isFlagged: node.is_flagged,
		hasFlag: node?.has_flag,
	}
}

export const normalizeTerms = (terms) => {
	return terms.map((term) => ({
		value: term.id,
		label: term.label,
	}))
}
