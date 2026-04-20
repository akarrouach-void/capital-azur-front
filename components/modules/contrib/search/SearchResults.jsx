import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import React, { useState, useEffect, useRef } from "react"
import { drupal } from "@vactorynext/core/drupal"
import {
	Container,
	Link,
	Wysiwyg,
	Pagination,
	LoadingOverlay,
	Icon,
	Input,
	Button,
	Heading,
	Text,
} from "@/ui"
import { useRouter } from "next/router"

const SearchResults = ({ items, items_found, itemsPerPage, q, page, internal_extra }) => {
	const router = useRouter()
	const locale = router.locale

	const scrollRefPagination = useRef()

	const [inputs, setInputs] = useState({
		keyword: q || "",
		posts: items || [],
		totalPosts: parseInt(items_found) || 0,
		pager: page || 1,
		isLoading: false,
		currentQueryFromUrl: router.query.q,
	})

	// To handle re-searching from SearchOverlay while you are in Search Results page
	const [inputValue, setInputValue] = useState(router.query.q)
	// To handle re-searching from SearchOverlay while you are in Search Results page
	useEffect(() => {
		if (inputs.currentQueryFromUrl !== router.query.q) {
			setInputs((prev) => ({ ...prev, keyword: router.query.q, pager: 1 }))
			setInputValue(router.query.q)
		}
	}, [router.query.q, q])

	const { profile } = useAccount()
	const { t } = useI18n()
	/* const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			keyword: q || "",
		},
	}) */

	const onSubmit = (e) => {
		e.preventDefault()
		setInputs((prev) => ({
			...prev,
			pager: 1,
			keyword: inputValue || "",
		}))
	}

	const handlePageChange = (pid) => {
		setInputs((prev) => ({
			...prev,
			pager: pid,
		}))
	}

	const updateURLHistory = () => {
		// Update URL history.
		let url = `${internal_extra.translations[locale]}`
		const params = []

		// Only add page parameter if page > 1 (Pretty Path Rule) - page comes first
		if (inputs.pager > 1) {
			params.push(`page=${inputs.pager}`)
		}

		// Add search query parameter after page
		if (inputs.keyword) {
			params.push(`q=${inputs.keyword}`)
		}

		if (params.length > 0) {
			url += `?${params.join("&")}`
		}

		return url
	}

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(updateURLHistory())

	// Build pagination base URL template
	const getPaginationBaseUrl = () => {
		// Always include page template placeholder for pagination (page first, then q)
		let baseUrl = `${internal_extra.translations[locale]}?page={page}`
		if (inputs.keyword) {
			baseUrl += `&q=${inputs.keyword}`
		}
		return baseUrl
	}

	const fetchData = async () => {
		const controller = new AbortController()
		setInputs((prev) => ({
			...prev,
			isLoading: true,
		}))

		try {
			const response = await drupal.fetch(
				`${locale}/api/search?pager=${inputs.pager}&q=${inputs.keyword}`,
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

			// setPosts(data?.resources || [])
			// setTotalPosts(parseInt(data?.count) || 0)
		} catch (err) {
			console.error(err)
		} finally {
			// setIsLoading(false)
			setInputs((prev) => ({
				...prev,
				isLoading: false,
			}))
		}

		return () => controller.abort()
	}

	useUpdateEffect(() => {
		fetchData()
		setShallowUrl(updateURLHistory())
	}, [inputs.pager, inputs.keyword])

	// Update page url using shallow.
	useUpdateEffect(() => {
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	return (
		<div ref={scrollRefPagination}>
			<Container>
				<form className="mt-8 flex flex-col items-start gap-4">
					<div className="flex w-full flex-col gap-3 md:max-w-xl md:flex-row">
						<Input
							variant="inline"
							prefix={<Icon id="search" className="h-4 w-4 text-gray"></Icon>}
							hasError={inputValue?.length === 0}
							errorMessage={t("Nx:Keyword is required")}
							placeholder={t("Nx:What are you searching for ?")}
							onChange={(e) => setInputValue(e.target.value)}
							value={inputValue}
							data-testid="search-input-page-results"
						/>

						<Button type="submit" variant="primary" onClick={(e) => onSubmit(e)}>
							{t("Nx:Submit")}
						</Button>
					</div>
					{inputs.totalPosts > 0 && (
						<Text variant="medium">
							{t("Nx:Total results found")} {inputs.totalPosts}.
						</Text>
					)}
				</form>

				{inputs?.keyword?.length > 0 && inputs.totalPosts <= 0 && !inputs.isLoading && (
					<Text
						data-testid="search-results-no-results"
						variant="small"
						className="mt-4 text-red-600"
					>
						{t("Nx:Aucun résultat n'a été trouvé !")}
					</Text>
				)}

				<div className="my-10 flow-root">
					<LoadingOverlay active={inputs.isLoading} spinner={true}>
						<ul>
							{inputs.posts.map((post) => (
								<li
									key={post.url}
									className="animate group mb-5 cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl"
								>
									<Link
										href={post.url}
										className="flex flex-col gap-5 p-5 lg:flex-row lg:content-center lg:items-center lg:justify-between lg:px-6 lg:py-8"
									>
										<div className="relative mb-2 focus-within:ring-2 focus-within:ring-primary-500">
											<Heading variant={5}>{post.title}</Heading>
											<Wysiwyg className="prose-sm text-gray-500" html={post.excerpt} />
										</div>
										<Text variant="permalink" className="animate shrink-0">
											{t("Nx:Lire plus")}
										</Text>
									</Link>
								</li>
							))}
						</ul>
					</LoadingOverlay>
				</div>

				{parseInt(inputs.totalPosts) > parseInt(itemsPerPage) && (
					<div className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
						<Pagination
							baseUrl={getPaginationBaseUrl()}
							contentRef={scrollRefPagination}
							pageSize={itemsPerPage}
							current={inputs.pager}
							total={inputs.totalPosts}
							onChange={(page) => handlePageChange(page)}
							id="search-results-pagination"
						/>
					</div>
				)}
			</Container>
		</div>
	)
}

export async function getServerSideProps(data, context) {
	const { session, locale } = data.props

	const params = context.query
	const q = params.q
	const pager = params.page || 1

	let items = []
	let items_found = 0
	const itemsPerPage = 10

	if (q) {
		try {
			const response = await drupal.fetch(`${locale}/api/search?pager=${pager}&q=${q}`, {
				withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
				headers: {
					"X-Auth-Provider": session?.provider || "",
				},
			})
			const data = await response.json()
			items = data?.resources || []
			items_found = data?.count || 0
		} catch (error) {
			console.error("[search]", error)
			// Do nothing.
		}
	}

	data.props.items = items
	data.props.items_found = items_found
	data.props.itemsPerPage = itemsPerPage
	data.props.q = q || ""
	data.props.page = pager

	return data
}

export default SearchResults
