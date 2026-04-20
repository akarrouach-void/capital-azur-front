import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { drupal } from "@vactorynext/core/drupal"
import { useI18n, useAccount, useUpdateEffect, useNode } from "@vactorynext/core/hooks"
import { Container, Link, Wysiwyg, Pagination, LoadingOverlay, Heading } from "@/ui"
import { ForumInputSearch } from "./../components/forumInputSearch"

export const config = {
	id: "vactory_forums:search_results",
}

const ForumSearchResultsWidget = () => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale

	const { path_18n } = useNode()
	const current_page_alias = path_18n[locale]
	const itemsPerPage = 10
	const { q, pager } = router.query

	const { profile } = useAccount()

	const [inputs, setInputs] = useState({
		keyword: q || "",
		posts: [],
		totalPosts: 0,
		pager: pager || 1,
		isLoading: false,
	})

	const updateURLHistory = () => {
		// Update URL history.
		let url = `${current_page_alias}?page=:page&q=:keyword`
		url = url.replace(":page", inputs.pager)
		url = url.replace(":keyword", inputs.keyword)
		return url
	}

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(updateURLHistory())

	const onSubmit = (data) => {
		setInputs((prev) => ({
			...prev,
			pager: 1,
			keyword: data?.keyword || "",
		}))
	}

	const handlePageChange = (pid) => {
		setInputs((prev) => ({
			...prev,
			pager: pid,
		}))
	}

	const fetchData = async () => {
		const controller = new AbortController()
		setInputs((prev) => ({
			...prev,
			isLoading: true,
		}))

		try {
			const response = await drupal.fetch(
				`${locale}/api/forums/search?q=${inputs.keyword}&pager=${inputs.pager}`,
				{
					withAuth: true,
					headers: {
						"X-Auth-Provider": profile?.provider,
					},
					signal: controller.signal,
				}
			)
			const data = await response.json()

			setInputs((prev) => ({
				...prev,
				posts: data?.resources || [],
				totalPosts: parseInt(data?.count) || 0,
			}))
		} catch (err) {
			console.error(err)
		} finally {
			setInputs((prev) => ({
				...prev,
				isLoading: false,
			}))
		}

		return () => controller.abort()
	}

	useEffect(() => {
		fetchData()
	}, [])

	useUpdateEffect(() => {
		fetchData()
		setShallowUrl(updateURLHistory())
	}, [inputs.pager, inputs.keyword])

	// Update page url using shallow.
	useUpdateEffect(() => {
		window.history.pushState(null, null, shallowUrl)
	}, [shallowUrl])

	return (
		<Container>
			{/* <Heading level={2} variant={2} className="mb-5">
				{node.title}
			</Heading> */}
			<div>
				<ForumInputSearch onSubmit={onSubmit} />
				{inputs.totalPosts > 0 && (
					<p className="my-5 text-right">
						{t("Nx:Total results found")} {inputs.totalPosts}.
					</p>
				)}

				{inputs.keyword.length > 0 && inputs.totalPosts <= 0 && !inputs.isLoading && (
					<h2>{t("Nx:Aucun résultat n'a été trouvé !")}</h2>
				)}
			</div>
			<div className="my-10 flow-root">
				<LoadingOverlay active={inputs.isLoading} spinner={true}>
					<ul>
						{inputs.posts.map((post) => (
							<li
								key={post.url}
								className="mb-5 flex	 flex-col rounded-md p-5 shadow-md lg:flex-row lg:content-center lg:justify-between"
							>
								<div className="relative mb-2 focus-within:ring-2 focus-within:ring-primary-500">
									<Heading variant={5}>
										<Link href={post.url}>
											{/* Extend touch target to entire panel */}
											<span className="absolute inset-0" aria-hidden="true" />
											{post.title}
										</Link>
									</Heading>
									<Wysiwyg
										className="mt-1 line-clamp-2 text-base text-gray-600"
										html={post.excerpt}
									/>
								</div>
								<Link href={post.url} variant="permalink">
									{t("Nx:Lire plus")}
								</Link>
							</li>
						))}
					</ul>
				</LoadingOverlay>
			</div>

			{parseInt(inputs.totalPosts) > parseInt(itemsPerPage) && (
				<div className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
					<Pagination
						baseUrl={shallowUrl.replace(/page=\d+/, "page={page}")}
						pageSize={itemsPerPage}
						current={inputs.pager}
						total={inputs.totalPosts}
						onChange={(page) => handlePageChange(page)}
						id="forum-search-pagination"
					/>
				</div>
			)}
		</Container>
	)
}

export default ForumSearchResultsWidget
