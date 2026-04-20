import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { drupal } from "@vactorynext/core/drupal"
import { deserialise } from "kitsu-core"
import { LoadingOverlay } from "@/ui"
import { normalizeNode } from "./normalizer"
import { Card } from "./card"

/*
EXAMPLE
const nextPrevInfo = {
    nid: node.drupal_internal__nid,
    resource: "vactory_news",
    queryParams: {
        fields: {
            "node--vactory_news": "title,path"
        },
        include: "",
        
    }
}
<NextPrev {...nextPrevInfo}/>
*/

export const NextPrev = ({ nid, resource, queryParams }) => {
	const router = useRouter()
	const locale = router.locale

	const [prevNode, setPrevNode] = useState(null)
	const [nextNode, setNextNode] = useState(null)
	const [loading, setLoading] = useState(false)

	const fetchData = async () => {
		setPrevNode(null)
		setNextNode(null)
		setLoading(true)

		async function load(filter) {
			const response = await drupal.getEntityCollection("node", resource, {
				locale: locale,
				params: {
					...filter,
					fields: queryParams?.fields,
					include: queryParams?.include || "",
				},
			})
			const deserialized = deserialise(response)

			return deserialized?.data?.[0] || null
		}

		async function loadPrev() {
			return load({
				"filter[prev][condition][path]": "drupal_internal__nid",
				"filter[prev][condition][operator]": "<",
				"filter[prev][condition][value]": nid,
				"sort[sort-nid][path]": "drupal_internal__nid",
				"sort[sort-nid][direction]": "DESC",
			})
		}

		async function loadNext() {
			return load({
				"filter[prev][condition][path]": "drupal_internal__nid",
				"filter[prev][condition][operator]": ">",
				"filter[prev][condition][value]": nid,
				"sort[sort-nid][path]": "drupal_internal__nid",
				"sort[sort-nid][direction]": "ASC",
			})
		}

		Promise.all([loadPrev(), loadNext()]).then((res) => {
			if (res[0]) {
				setPrevNode(normalizeNode(res[0]))
			}

			if (res[1]) {
				setNextNode(normalizeNode(res[1]))
			}

			setLoading(false)
		})
	}

	useEffect(() => {
		fetchData()
	}, [nid])

	return (
		<LoadingOverlay active={loading} minHeight={0} spinner={true}>
			{prevNode && <Card {...prevNode} direction="left" />}
			{nextNode && <Card {...nextNode} direction="right" />}
		</LoadingOverlay>
	)
}
