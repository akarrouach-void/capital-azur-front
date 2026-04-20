import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import React, { useState, useRef } from "react"
import { drupal } from "@vactorynext/core/drupal"
import { normalizeNodes } from "./normalizer"
import {
	Link,
	Pagination,
	LoadingOverlay,
	Icon,
	Input,
	Button,
	Text,
	Heading,
	Container,
} from "@/ui"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

const itemsPerPage = 15

const AdvancedSearchResults = ({ nodes, facetsItems, items_found }) => {
	const ref = useRef()
	const router = useRouter()
	const locale = router.locale
	const { profile } = useAccount()
	const [results, setResults] = useState(normalizeNodes(nodes))
	const [facets, setFacets] = useState(facetsItems)
	const [isLoading, setIsLoading] = useState(false)
	const { t } = useI18n()
	const [filters, setFilters] = useState({
		facets: {},
		page: 1,
		count: items_found,
	})
	const { register, handleSubmit, reset } = useForm()

	const fetchData = async () => {
		const controller = new AbortController()
		const facets = Object.keys(filters?.facets)
		let query = ""
		let i = 0
		for (let facet of facets) {
			if (filters?.facets[facet] !== "") {
				if (facet === "fulltext") {
					query += `&filter[fulltext]=${filters?.facets[facet]}`
				} else {
					query += `&f[${i}]=${facet}:${filters?.facets[facet]}`
					i++
				}
			}
		}
		try {
			setIsLoading(true)
			const offset = (filters.page - 1) * itemsPerPage
			const response = await drupal.fetch(
				`${locale}/api/index/default_content_index?filter[langcode]=${locale}&page[limit]=${itemsPerPage}&page[offset]=${offset}${query}`,
				{
					withAuth: true,
					headers: {
						"X-Auth-Provider": profile?.provider,
					},
					signal: controller.signal,
				}
			)
			const data = await response.json()
			setResults(normalizeNodes(data?.data))
			setFilters((prev) => ({
				...prev,
				count: data?.meta?.count,
			}))
			setFacets(data?.meta?.facets)
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const onSubmit = (data) => {
		setFilters((prev) => ({
			...prev,
			facets: data,
			page: 1,
		}))
	}

	const onReset = () => {
		reset({
			fulltext: "",
		})
		setFilters((prev) => ({
			...prev,
			facets: {},
			page: 1,
		}))
	}

	useUpdateEffect(() => {
		fetchData()
	}, [filters.page, filters.facets])

	const handlePageChange = (pid) => {
		setFilters((prev) => ({
			...prev,
			page: pid,
		}))
	}

	const handleChangeFacet = (event, id) => {
		const value = event.target.value
		const oldFacets = filters?.facets
		oldFacets[id] = value
		setFilters((prev) => ({
			...prev,
			facets: {
				...prev.facets,
				...oldFacets,
			},
			page: 1,
		}))
	}
	return (
		<Container>
			<LoadingOverlay active={isLoading} spinner={true}>
				<div className="my-8 flex flex-col gap-8 lg:flex-row" ref={ref}>
					{/* Sidebar Filters */}
					<div className="w-full lg:w-80">
						<div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
							<Heading level={3} variant={4} className="mb-6 text-gray-900">
								{t("Nx:Search Filters")}
							</Heading>

							<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
								<div>
									<Input
										variant="inline"
										{...register("fulltext", {})}
										prefix={<Icon id="search" className="h-4 w-4 text-gray" />}
										placeholder={t("Nx:What are you searching for ?")}
									/>
								</div>

								{facets?.map((facet) => (
									<div
										key={facet.id}
										className="rounded-lg border border-gray-200 bg-gray-50 p-4"
									>
										<Text className="mb-3 font-medium text-gray-900">{facet.label}</Text>
										<div className="space-y-2">
											<label
												htmlFor={`${facet.id}--any`}
												className="flex items-center text-sm text-gray-700"
											>
												<input
													type="radio"
													id={`${facet.id}--any`}
													name={facet.path}
													className="mr-3 h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
													value=""
													onClick={(event) => handleChangeFacet(event, facet.id)}
													checked={
														filters?.facets[facet.id] === "" ||
														filters?.facets[facet.id] === undefined
													}
													{...register(facet.id, {})}
												/>
												{t("Nx:Any")}
											</label>

											{facet?.terms?.map((term) => (
												<label
													key={term.url}
													htmlFor={`${facet.id}--${term.values.value}`}
													className="flex items-center justify-between text-sm text-gray-700"
												>
													<div className="flex items-center">
														<input
															type="radio"
															id={`${facet.id}--${term.values.value}`}
															name={facet.path}
															value={term.values.value}
															className="mr-3 h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
															checked={filters?.facets[facet.id] === term.values.value}
															onClick={(event) => handleChangeFacet(event, facet.id)}
															defaultChecked={term.values.active}
															{...register(facet.id, {})}
														/>
														<span>{term.values.label}</span>
													</div>
													<span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
														{term.values.count}
													</span>
												</label>
											))}
										</div>
									</div>
								))}

								<div className="flex gap-3">
									<Button
										disabled={isLoading}
										type="submit"
										variant="primary"
										className="flex-1"
									>
										{t("Nx:Submit")}
									</Button>
									<Button
										disabled={isLoading}
										onClick={onReset}
										type="button"
										variant="secondary"
										className="flex-1"
									>
										{t("Nx:Reset")}
									</Button>
								</div>
							</form>
						</div>
					</div>

					{/* Results */}
					<div className="flex-1">
						{!results.length ? (
							<div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
								<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
									<Icon id="search" className="h-6 w-6 text-gray-400" />
								</div>
								<Heading level={3} variant={4} className="mb-2 text-gray-900">
									{t("Nx:No results found")}
								</Heading>
								<Text className="text-gray-600">
									{t("Nx:Try adjusting your search terms or filters")}
								</Text>
							</div>
						) : (
							<div className="space-y-6">
								{filters?.count > 0 && (
									<div className="rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
										<Text variant="medium">
											{t("Nx:Total results found")} {filters.count}.
										</Text>
									</div>
								)}

								<div className="space-y-4">
									{results.map((node, i) => (
										<div
											key={i}
											className="animate group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl"
										>
											<Link href={node?.url || "#."} className="block p-6">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<Heading
															variant={5}
															className="mb-2 text-gray-900 group-hover:text-primary-600"
														>
															{node?.title}
														</Heading>
														<Text className="prose-sm mb-3 line-clamp-2 text-gray-500">
															{node?.excerpt}
														</Text>
													</div>
													{node?.date && (
														<time
															dateTime={node?.date}
															className="ml-4 flex-shrink-0 text-sm text-gray-400"
														>
															{node?.date}
														</time>
													)}
												</div>
												<Text variant="permalink" className="animate">
													{t("Nx:Lire plus")}
												</Text>
											</Link>
										</div>
									))}
								</div>

								{parseInt(filters.count) > parseInt(itemsPerPage) && (
									<div className="rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm">
										<Pagination
											contentRef={ref}
											pageSize={itemsPerPage}
											current={filters.page}
											total={filters.count}
											onChange={(page) => handlePageChange(page)}
											id="advanced-search-pagination"
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</LoadingOverlay>
		</Container>
	)
}

export async function getServerSideProps(data) {
	const { session, locale } = data.props
	let items = []
	let items_found = 0
	let facets = []

	try {
		const response = await drupal.fetch(
			`${locale}/api/index/default_content_index?filter[langcode]=${locale}&page[limit]=${itemsPerPage}`,
			{
				withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
				headers: {
					"X-Auth-Provider": session?.provider || "",
				},
			}
		)
		const data = await response.json()
		items = data?.data
		items_found = data?.meta?.count
		facets = data?.meta?.facets
	} catch {
		// do nothing
	}

	data.props.nodes = items
	data.props.items_found = items_found
	data.props.itemsPerPage = itemsPerPage
	data.props.page = 1
	data.props.facetsItems = facets

	return data
}

export default AdvancedSearchResults
