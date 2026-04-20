import { IconCtaCard } from "./IconCtaCard"
import { useAccount } from "@vactorynext/core/hooks"
import React, { useMemo } from "react"
import { useProject } from "../full/MonProjet"
import { MonProjetReduced } from "./MonProjetReduced"

export const config = {
	id: "project_progress:reduced",
}

const normalizer = (data) => {
	const dynamize = !!data?.components?.[0]?.dynamize
	const title = data?.components?.[0]?.title || null
	const titleIcon = data?.components?.[0]?.title_icon || null
	const action = data?.components?.[0]?.link || {}
	action["icon"] = data?.components?.[0]?.link_icon || null
	const subtitle = data?.components?.[0]?.group_non_initialized?.subtitle
	const _link = data?.components?.[0]?.group_non_initialized?.link
	const authenticatedCardData = {
		title: subtitle,
		text: data?.components?.[0]?.group_non_initialized?.text?.value?.["#text"],
		icon: data?.components?.[0]?.group_non_initialized?.icon,
		link: _link?.url && _link.title ? _link : action,
	}
	const anonynousCardData = {
		...authenticatedCardData,
		extraText: data?.components?.[0]?.group_anonymous?.text?.value?.["#text"],
	}
	const projectData = data?.data?.[0] || []
	return {
		projectData,
		dynamize,
		title,
		titleIcon,
		action,
		subtitle,
		authenticatedCardData,
		anonynousCardData,
	}
}

const MonProjetReducedWidget = (props) => {
	const { data } = props
	const { isAuthenticated } = useAccount()
	const {
		projectData,
		dynamize,
		action,
		subtitle,
		authenticatedCardData,
		anonynousCardData,
	} = normalizer(data)
	const { isInitialized } = useProject(projectData)
	const dynamicBlock = useMemo(() => {
		if (dynamize) {
			if (isInitialized) {
				return <MonProjetReduced {...{ subtitle, action, projectData }} />
			} else {
				if (isAuthenticated) {
					return <IconCtaCard item={authenticatedCardData} />
				} else {
					return <IconCtaCard item={anonynousCardData} />
				}
			}
		} else {
			return <MonProjetReduced {...{ subtitle, action, projectData }} />
		}
	}, [])
	return dynamicBlock
}

export default MonProjetReducedWidget
