import { useState } from "react"
import { deserialise } from "kitsu-core"
import { useRouter } from "next/router"
import { useUpdateEffect } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"

const useNodesCollection = ({
	nodeType = "",
	initialPosts = [],
	initialPostsCount = 0,
	params = {},
}) => {
	const router = useRouter()
	const locale = router.locale
	const [inputs, setInputs] = useState({
		posts: initialPosts,
		count: initialPostsCount,
		isLoading: false,
	})

	const fetchData = async () => {
		const controller = new AbortController()
		setInputs((prev) => ({
			...prev,
			isLoading: true,
		}))

		try {
			const response = await drupal.getNodeCollection(nodeType, {
				locale: locale,
				params: params,
				signal: controller.signal,
			})
			setInputs((prev) => ({
				...prev,
				posts: deserialise(response)?.data || [],
				count: response.meta.count,
				isLoading: false,
			}))
		} catch (err) {
			// @todo: Toast
			console.error(err)
			setInputs((prev) => ({
				...prev,
				isLoading: false,
			}))
		}

		return () => controller.abort()
	}

	useUpdateEffect(() => {
		fetchData()
	}, [params])

	return {
		posts: inputs.posts,
		count: inputs.count,
		isLoading: inputs.isLoading,
	}
}

export default useNodesCollection
