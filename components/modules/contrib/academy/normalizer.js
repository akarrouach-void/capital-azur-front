import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const normalizeNodes = (nodes) => {
	return nodes?.map((node) => normalizeSingleNode(node)) || []
}

export const normalizeSingleNode = (node, allow_truncate = true) => {
	return {
		id: node.drupal_internal__nid,
		title: get(node, "title", null),
		url: get(node, "path.alias", "#."),
		duree: get(node, "field_academy_duree", null),
		langue: get(node, "field_vactory_academy_langue", null),
		date: get(node, "field_vactory_date", null),
		excerpt: allow_truncate
			? truncate(stripHtml(get(node, "field_vactory_excerpt.processed", "")), 100)
			: truncate(stripHtml(get(node, "field_vactory_excerpt.processed", ""))),
		image: get(node, "field_vactory_media.thumbnail", null),
		document: get(
			node,
			"field_vactory_media_document.field_media_file.uri.value._default",
			null
		),
		instructor: get(node, "field_vactory_instructor.display_name", null),
		tags: get(node, "field_vactory_tags", [])
			.map((term) => term.name)
			.filter((t) => typeof t !== "undefined"),
		theme: get(node, "field_vactory_theme.name", null),
		video_youtube: get(node, "field_vactory_youtube_videos", null),
		video: get(node, "field_vactory_youtube_media.field_media_oembed_video", null),
		isFlagged: node.is_flagged,
		hasFlag: node?.has_flag,
		// TODO: fix this later
		vote: node?.vote || [],
	}
}
