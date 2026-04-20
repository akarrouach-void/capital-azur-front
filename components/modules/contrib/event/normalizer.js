import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

const formatDate = (date, options) => {
	if (date == null || date == undefined) {
		return null
	}
	let _options = options ? options : { year: "numeric", month: "long", day: "numeric" }
	options.timeZone = "UTC"
	let formatedDate = new Date(date)
	return formatedDate.toLocaleDateString("fr", _options)
}

export const normalizeNodes = (nodes) => {
	return nodes.map((post) => ({
		id: post.drupal_internal__nid,
		isFlagged: post?.is_flagged,
		hasFlag: post?.has_flag,
		title: post.title,
		url: get(post, "path.alias", "#."),
		excerpt: truncate(stripHtml(get(post, "field_vactory_excerpt.processed", "")), 100),
		dateStart: formatDate(get(post, "field_vactory_date_interval.value"), {
			month: "long",
			day: "numeric",
		}),
		dateEnd: formatDate(get(post, "field_vactory_date_interval.end_value", null), {
			month: "long",
			day: "numeric",
		}),
		category: get(post, "field_vactory_taxonomy_1", [])
			?.map((term) => {
				return {
					name: term.name,
					slug: term?.term_2_slug || "",
				}
			})
			.filter((t) => typeof t !== "undefined"),
		city: {
			name: get(post, "field_vactory_taxonomy_2.name", null),
			slug: get(post, "field_vactory_taxonomy_2.term_2_slug", null),
		},
		image: {
			src: post?.field_vactory_media?.thumbnail?.uri?.value?._default,
			alt: post?.field_vactory_media?.thumbnail?.meta?.alt,
			width: post?.field_vactory_media?.thumbnail?.meta?.width,
			height: post?.field_vactory_media?.thumbnail?.meta?.height,
		},
	}))
}

export const normalizeVCC = (nodes) => {
	return nodes.map((post) => ({
		id: post.drupal_internal__nid,
		title: post.title,
		url: post?.url,
		excerpt: truncate(stripHtml(post?.excerpt?.[0]?.value || ""), 100),
		dateStart: formatDate(post?.date?.value?.html_date, {
			month: "long",
			day: "numeric",
		}),
		dateEnd: formatDate(post?.date?.end_value?.html_date, {
			month: "long",
			day: "numeric",
		}),
		category: [post?.tag],
		city: post?.city,
		image: {
			src: post?.image?._default,
			alt: post?.image?.meta?.alt,
			title: post?.title,
		},
	}))
}

export const normalizeNode = (node) => {
	return {
		id: node?.drupal_internal__nid,
		image: get(node, "field_vactory_media.thumbnail", null),
		title: get(node, "title", null),
		dateStart: formatDate(node?.field_vactory_date_interval?.value, {
			month: "long",
			day: "numeric",
		}),
		dateEnd: formatDate(node?.field_vactory_date_interval?.end_value, {
			month: "long",
			day: "numeric",
		}),
		body: get(node, "body.processed", null),
		category: get(node, "field_vactory_taxonomy_1.[0].name", null),
		city: get(node, "field_vactory_taxonomy_2.name", null),
		tags: node.field_vactory_tags.map((tag) => [tag.name]),
		hasFlag: node?.has_flag,
		isFlagged: node?.is_flagged,
	}
}

export const normalizeTerms = (terms) => {
	return terms.map((term) => ({
		id: term.drupal_internal__tid,
		name: term.name,
	}))
}
