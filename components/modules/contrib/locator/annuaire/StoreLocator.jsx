import {
	Container,
	Link,
	Wysiwyg,
	Pagination,
	LoadingOverlay,
	Button,
	AutocompleteApi,
	Text,
	Heading,
	Icon,
} from "@/ui"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { drupal } from "@vactorynext/core/drupal"
import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import { query } from "@vactorynext/core/lib"

import GmapStore from "../Gmap/Gmap-locator"
import { config } from "../CategoriesList"
import CategoryFilter from "./CategoryFilter"
import LocatorBoxSeo, { LocatorBoxSeoInit } from "./LocatorBoxSeo"

const StoreLocator = ({
	items,
	items_found,
	itemsPerPage,
	category,
	categories,
	page,
	locality,
	internal_extra,
	initialGrouping,
}) => {
	const [inputs, setInputs] = useState({
		category: category || "",
		locality: locality || "",
		posts: items || [],
		totalPosts: parseInt(items_found) || 0,
		pager: page || 1,
		isLoading: false,
	})

	const router = useRouter()
	const { profile } = useAccount()
	const locale = router.locale
	const { t } = useI18n()
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			category: category || "",
			locality: locality || "",
		},
	})

	const onSubmit = (data) => {
		setInputs((prev) => ({
			...prev,
			pager: 1,
			category: data?.category || "",
			locality: data?.locality || "",
		}))
		// setPager(1)
		// setKeyword(data?.keyword || "")
	}

	const handlePageChange = (pid) => {
		// setPager(pid)
		setInputs((prev) => ({
			...prev,
			pager: pid,
			// keyword: data?.keyword || ""
		}))
	}

	const updateURLHistory = () => {
		// Update URL history.
		let url = `${window.location.origin}${internal_extra.translations[locale]}?pager=:pager`

		url = enhanceUrl(url)
		url = url.replace(":pager", inputs.pager)
		// url = url.replace(":category", inputs.category)
		// url = url.replace(":locality", inputs.locality)
		window.history.pushState(null, null, url)
	}

	const enhanceUrl = (url) => {
		if (inputs.category) {
			url = `${url}&category=${inputs.category}`
		}
		if (inputs.locality) {
			url = `${url}&locality=${inputs.locality}`
		}
		return url
	}

	const fetchData = async () => {
		const controller = new AbortController()
		// setIsLoading(true)
		setInputs((prev) => ({
			...prev,
			isLoading: true,
		}))

		try {
			let endpoint = `${locale}/api/store-locator?pager=${inputs.pager}`
			endpoint = enhanceUrl(endpoint)
			const response = await drupal.fetch(`${endpoint}`, {
				withAuth: true,
				headers: {
					"X-Auth-Provider": profile?.provider,
				},
				signal: controller.signal,
			})
			const data = await response.json()
			setInputs((prev) => ({
				...prev,
				posts: data?.resources || [],
				totalPosts: parseInt(data?.count) || 0,
				isLoading: false,
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
		updateURLHistory()
	}, [inputs.pager, inputs.category, inputs.locality])

	return (
		<Container className="my-7">
			<LoadingOverlay active={inputs.isLoading} spinner={true}>
				{/* Header */}
				<div className="mb-8 rounded-xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-12">
					<div className="mb-6 text-center">
						<Heading className="text-gray-900" level={2}>
							{t("Nx:Store Locator")}
						</Heading>
						<Text className="mt-2 text-sm text-gray-600">
							{t("Nx:Find stores and locations near you")}
						</Text>
					</div>

					{/* Search Form */}
					<form className="mx-auto max-w-2xl space-y-6" onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-4 md:grid-cols-2">
							<CategoryFilter
								{...register("category", {})}
								categories={categories}
								control={control}
							/>

							<AutocompleteApi
								{...register("locality", {})}
								endpoint={`${locale}/api/cities.json`}
								hasError={errors?.locality}
								control={control}
								queryName="city"
								defaultValue={inputs.locality}
								errorMessage={errors?.locality?.message}
								label={t("Nx:locality")}
								placeholder={t("Nx:locality")}
							/>
						</div>

						<div className="flex justify-center">
							<Button type="submit" variant="gradient" className="px-8">
								{inputs.isLoading ? t("Nx:Searching...") : t("Nx:Search")}
							</Button>
						</div>
					</form>

					{/* Results Summary */}
					<div className="mt-6 text-center">
						{inputs.locality && (
							<Text className="mb-2 text-gray-700">
								{t("Agences à")} <span className="font-semibold">{inputs.locality}</span>
							</Text>
						)}
						{inputs.totalPosts > 0 && (
							<Text variant="small" className="text-gray-600">
								{t("Nx:Found")}{" "}
								<span className="font-semibold text-gray-900">{inputs.totalPosts}</span>{" "}
								{t("Nx:results")}
							</Text>
						)}
						{inputs.category.length > 0 &&
							inputs.totalPosts <= 0 &&
							!inputs.isLoading && (
								<Text variant="small" className="text-red-600">
									{t("Nx:Aucun résultat n'a été trouvé !")}
								</Text>
							)}
					</div>
				</div>

				{/* Results and Map */}
				{inputs.totalPosts > 0 && (
					<div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
						<div className="flex flex-col md:max-h-[700px] md:flex-row">
							{/* Sidebar Results */}
							<div className="flex flex-col border-b border-gray-200 md:w-96 md:border-b-0 md:border-r">
								<div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
									<Heading level={3} variant={5} className="text-gray-900">
										{t("Nx:Locations")}
									</Heading>
								</div>

								<div className="flex-1 overflow-y-auto p-2">
									<div className="space-y-2">
										{inputs.posts.map((post) => (
											<div
												key={post.id}
												className="group relative rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
											>
												<div className="mb-3">
													<Heading
														variant={6}
														className="mb-1 text-gray-900 group-hover:text-primary-600"
													>
														<Link
															href={post.url}
															className="before:absolute before:inset-0"
														>
															{post.name}
														</Link>
													</Heading>
													{post.field_locator_category && (
														<Text className="text-xs font-medium text-primary-600">
															{post.field_locator_category}
														</Text>
													)}
												</div>

												<div className="space-y-1 text-sm text-gray-600">
													{post.field_locator_email && (
														<div className="flex items-start gap-2">
															<Icon id="mail" className="mt-0.5 h-3 w-3 flex-shrink-0" />
															<span>{post.field_locator_email}</span>
														</div>
													)}
													{post.field_locator_phone && (
														<div className="flex items-start gap-2">
															<Icon id="phone" className="mt-0.5 h-3 w-3 flex-shrink-0" />
															<span>{post.field_locator_phone}</span>
														</div>
													)}
													{post.field_locator_fax && (
														<div className="flex items-start gap-2">
															<Icon
																id="printer"
																className="mt-0.5 h-3 w-3 flex-shrink-0"
															/>
															<span>{post.field_locator_fax}</span>
														</div>
													)}
													{post.field_locator_autre && (
														<div className="flex items-start gap-2">
															<Icon id="clock" className="mt-0.5 h-3 w-3 flex-shrink-0" />
															<span>{post.field_locator_autre}</span>
														</div>
													)}
												</div>

												{post.field_locator_description && (
													<Wysiwyg
														className="prose-sm mt-3 text-gray-500"
														html={post.field_locator_description}
													/>
												)}
											</div>
										))}
									</div>
								</div>

								{/* Pagination */}
								{parseInt(inputs.totalPosts) > parseInt(itemsPerPage) && (
									<div className="border-t border-gray-200 p-4">
										<Pagination
											variant="small"
											pageSize={itemsPerPage}
											current={inputs.pager}
											total={inputs.totalPosts}
											onChange={(page) => handlePageChange(page)}
											id="store-locator-pagination"
										/>
									</div>
								)}
							</div>

							{/* Map */}
							<div className="flex-1">
								<GmapStore
									items={inputs?.posts}
									mapApikey={process.env.GOOGLE_MAPS_KEY}
									marker={"./Gmap/images/marker.png"}
								/>
							</div>
						</div>
					</div>
				)}

				{/* Empty State */}
				{inputs.totalPosts === 0 &&
					!inputs.isLoading &&
					(inputs.category || inputs.locality) && (
						<div className="rounded-xl bg-white px-6 py-12 text-center shadow-sm">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
								<Icon id="map-pin" className="h-6 w-6 text-gray-400" />
							</div>
							<Heading level={3} className="mb-2 text-gray-900">
								{t("Nx:No locations found")}
							</Heading>
							<Text className="text-gray-600">
								{t("Nx:Try adjusting your search criteria or location")}
							</Text>
						</div>
					)}
			</LoadingOverlay>

			{/* SEO Box */}
			<div className="mt-10">
				<LocatorBoxSeo city={inputs.locality} seoGrouping={initialGrouping} />
			</div>
		</Container>
	)
}

const fetchCategories = async (data) => {
	const { session, locale } = data.props

	try {
		const q = query(config?.params || [])
		const endpoint = `${locale}/api/taxonomy_term/locator_category?${q}`
		const response = await drupal.fetch(`${endpoint}`, {
			withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
			headers: {
				"X-Auth-Provider": session?.provider || "",
			},
		})
		let data = await response.json()
		data = data ? drupal.deserialize(data)?.data : []
		return data
	} catch {
		// Do nothing.
	}
}

const fetchInitialLocator = async (data, context) => {
	const { session, locale } = data.props
	const { category, locality, pager = 1 } = context.query

	let items = []
	let items_found = 0
	let endpoint = `${locale}/api/store-locator?pager=${pager}`
	if (category) {
		endpoint = `${endpoint}&category=${category}`
	}
	if (locality) {
		endpoint = `${endpoint}&locality=${locality}`
	}

	try {
		const response = await drupal.fetch(`${endpoint}`, {
			withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
			headers: {
				"X-Auth-Provider": session?.provider || "",
			},
		})
		const data = await response.json()
		items = data?.resources || []
		items_found = data?.count || 0
		return [items, items_found]
	} catch {
		// Do nothing.
	}
}

export async function getServerSideProps(data, context) {
	const { category, locality, pager = 1 } = context.query
	const itemsPerPage = 10
	let items = []
	let items_found = 0

	const [categories, locatorItems, initialSeoBox] = await Promise.all([
		fetchCategories(data),
		fetchInitialLocator(data, context),
		LocatorBoxSeoInit(data, context),
	])
	items = locatorItems[0]
	items_found = locatorItems[1]

	data.props.items = items
	data.props.items_found = items_found
	data.props.itemsPerPage = itemsPerPage
	data.props.category = category || ""
	data.props.locality = locality || ""
	data.props.page = pager
	data.props.categories = categories || []
	data.props.initialGrouping = initialSeoBox || []

	return data
}

export default StoreLocator
