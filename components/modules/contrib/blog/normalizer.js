import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

const formatDate = (date, options) => {
	let _options = options ? options : { year: "numeric", month: "long", day: "numeric" }
	options.timeZone = "UTC"
	let formatedDate = new Date(date)
	return formatedDate.toLocaleDateString("fr", _options)
}

export const normalizeNodes = (nodes) => {
	return (
		nodes?.map((post) => ({
			id: post.drupal_internal__nid,
			title: post.title,
			url: get(post, "path.alias", "#."),
			excerpt: truncate(stripHtml(get(post, "field_vactory_excerpt.processed", "")), 100),
			category: {
				name: get(post, "field_blog_category.name", ""),
				slug: get(post, "field_blog_category.term_2_slug", ""),
			},
			image: {
				src: post?.field_vactory_media?.thumbnail?.uri?.value?._default,
				alt: post?.field_vactory_media?.thumbnail?.meta?.alt,
				width: post?.field_vactory_media?.thumbnail?.meta?.width,
				height: post?.field_vactory_media?.thumbnail?.meta?.height,
			},
			hasFlag: post?.has_flag,
			isFlagged: post?.is_flagged,
		})) || []
	)
}

export const normalizeNode = (node) => {
	return {
		id: node?.drupal_internal__nid,
		image: get(node, "field_vactory_media.thumbnail", null),
		title: get(node, "title", null),
		date: formatDate(node?.created, {
			month: "long",
			day: "numeric",
			year: "numeric",
		}),
		body: get(node, "body.processed", null),
		category: get(node, "field_blog_category.name", null),
		tags: get(node, "field_blog_tags.name", null),
		isFlagged: node?.is_flagged,
		hasFlag: node?.has_flag,
	}
}

export const normalizeTerms = (terms) => {
	return terms.map((term) => ({
		id: term.drupal_internal__tid,
		name: term.name,
	}))
}

export const normalizeVCC = (nodes) => {
	return (
		nodes?.map((post) => ({
			id: post.id,
			image: {
				src: post?.image?._default,
				alt: post?.image?.meta?.alt,
				title: post?.title,
			},
			category: post?.tag,
			title: post?.title,
			excerpt: truncate(stripHtml(post?.excerpt?.[0]?.value || ""), 100),
			url: post?.url,
		})) || []
	)
}
