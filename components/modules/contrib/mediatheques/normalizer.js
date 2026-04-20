import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"
import { Wysiwyg } from "@/ui"

export const normalizeNodes = (nodes) => {
	return (
		nodes.map((post) => ({
			id: post.drupal_internal__nid,
			title: post.title,
			url: get(post, "path.alias", "#."),
			excerpt: truncate(stripHtml(get(post, "field_vactory_excerpt.processed", "")), 100),
			theme: get(post, "field_mediatheque_theme.name", null),
			type: get(post, "field_mediatheque_type.name", null),
			video: get(post, "field_mediatheque_video.field_media_oembed_video", null),
			image: get(post, "field_vactory_media.thumbnail", null),
			date: get(post, "field_mediatheque_date", null),
		})) || []
	)
}

export const normalizeTerms = (terms) => {
	return terms.map((term) => ({
		value: term.id,
		label: term.label,
	}))
}

export const normalizeNode = (node) => {
	return {
		video: get(node, "field_mediatheque_video.field_media_oembed_video", null),
		title: get(node, "title", null),
		image: get(node, "field_vactory_media.thumbnail", null),
		category: get(node, "field_mediatheque_theme.name", null),
		date: get(node, "field_mediatheque_date", null),
		excerpt: get(node, "field_vactory_excerpt.processed", null),
		body: get(node, "field_body.processed", null),
		tags: node.field_vactory_tags.map((tag) => [tag.name]),
		document: get(
			node,
			"field_vactory_media_document.field_media_file.uri.value._default",
			null
		),
	}
}

export const normalizeVCC = (nodes) => {
	return nodes?.map((post) => ({
		id: post.id,
		image: post?.image,
		category: post?.tag,
		date: post?.date?.html_date,
		title: post?.title,
		excerpt: <Wysiwyg html={truncate(stripHtml(post?.excerpt?.[0]?.value, 100))} />,
		url: post?.url,
	}))
}
