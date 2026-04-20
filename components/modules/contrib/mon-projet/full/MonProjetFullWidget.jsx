import React from "react"
import get from "lodash.get"
import MonProjet from "./MonProjet"

export const config = {
	id: "project_progress:full",
}

const normalizer = (data) => ({
	title: get(data, "components.0.title", null),
	titleIcon: get(data, "components.0.title_icon", null),
})

const MonProjetFullContainer = (props) => {
	const { data } = props
	const { title, titleIcon } = normalizer(data)
	const projectData = data?.data?.[0] || []

	return <MonProjet {...{ title, titleIcon, projectData }} />
}

export default MonProjetFullContainer
