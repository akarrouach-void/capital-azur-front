import React from "react"
import { ForumInputSearch } from "./../components/forumInputSearch"
import { useRouter } from "next/router"
import get from "lodash.get"

export const config = {
	id: "vactory_forums:forum_search_input",
}

const ForumInputSearchWidget = ({ data }) => {
	const search_results_url = get(data, "components.0.forum_search_path.url", "")
	const router = useRouter()

	const onSubmit = (data) => {
		router.push(`${search_results_url}?pager=1&q=${data?.keyword || ""}`)
	}

	if (search_results_url == "") {
		return <></>
	}

	return <ForumInputSearch onSubmit={onSubmit} />
}

export default ForumInputSearchWidget
