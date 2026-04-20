import {
	generateDefaultValues,
	generateIdsFromTermsSlug,
	generateTermsSlugFromIds,
	useDataHandling,
	dlPush,
	stripHtml,
} from "@vactorynext/core/lib"

import { useEffect, useState } from "react"
import { useCollectionFetcher, useUpdateEffect } from "@vactorynext/core/hooks"
import { normalizeNodes } from "./normalizer"
import {
	Button,
	LoadingOverlay,
	Accordion,
	Pagination,
	Heading,
	Wysiwyg,
	EmptyBlock,
	Container,
	SelectNative,
	Icon,
	Text,
} from "@/ui"
import { useForm, Controller } from "react-hook-form"
import Script from "next/script"

export const config = {
	id: "vactory_faq:list",
}

const FaqListingWidget = ({ data }) => {
	/**
	 * Custom hook for handling various data-related functionalities,
	 * including pagination, filters, translation, and context.
	 **/
	const {
		scrollRefPagination,
		t,
		router,
		systemRoute,
		current_page_alias,
		defaultPageLimit,
		context,
		pager,
		setPager,
		filters,
		setFilters,
		loaded,
	} = useDataHandling(data)

	// Generate default values for terms
	const allTerms = generateDefaultValues(
		"faq_section",
		t("Nx:Quel sujet concerne votre question"),
		context
	)

	// Extract term slug from node alias and convert it to term id.
	const defaultTerm = generateIdsFromTermsSlug(
		systemRoute?._query?.term,
		context.terms.faq_section,
		allTerms.id
	)
	const [selectedTerm, setSelectedTerm] = useState(defaultTerm)
	const nodeAliasPath = `${current_page_alias}/{term}?page={page}`

	const getDefaultUrl = () => {
		let defaultAlias = nodeAliasPath

		defaultAlias =
			selectedTerm === allTerms.id
				? defaultAlias.replace("/{term}", "")
				: defaultAlias.replace("{term}", selectedTerm)

		return defaultAlias
	}

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(getDefaultUrl())
	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(getDefaultUrl())

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			term: defaultTerm,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_faq",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Function to replace double quotes with single quotes
	const escapeQuotes = (text) => text.replace(/"/g, "'")

	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: posts.flatMap((post) =>
			post.items.map((item) => ({
				"@type": "Question",
				name: escapeQuotes(item.button),
				acceptedAnswer: {
					"@type": "Answer",
					text: escapeQuotes(stripHtml(item.panel.props.html)),
				},
			}))
		),
	}

	// Submit filter form.
	const submitFilterForm = (data) => {
		setSelectedTerm(data?.term)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			term: allTerms.id,
		})
		setPager(1)
		setSelectedTerm(allTerms.id)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath =
			selectedTerm === allTerms.id
				? nodeAliasPath.replace("/{term}", "")
				: nodeAliasPath.replace(
						"{term}",
						generateTermsSlugFromIds(selectedTerm, context.terms.faq_section, allTerms.id)
					)
		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		setShallowUrl(newNodeAliasPath.replace(/[?&]page=1\b/, ""))
		setPaginationShallowUrl(newNodeAliasPath)
	}

	useUpdateEffect(() => {
		updatePrettyPath()

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedTerm || selectedTerm === allTerms.id) {
				// try to delete previously set term filters.
				delete filters?.filter?.term
			} else {
				// Add a term filter.
				filters.filter.term = {
					condition: {
						path: "field_vactory_taxonomy_1.drupal_internal__tid",
						operator: "=",
						value: selectedTerm,
					},
				}
			}

			// Update pager.
			filters.page = {
				...filters.page,
				offset: (pager - 1) * (filters?.page?.limit || defaultPageLimit),
			}

			return filters
		})
	}, [selectedTerm, pager])

	// Updating pretty path at first load
	useEffect(() => updatePrettyPath(), [loaded])

	// trigger data layer event when visiting a faq
	const handleOpenedNode = (level1, level2) => {
		dlPush("Question FAQ", {
			"Niveau 1": level1,
			"Niveau 2": level2.button,
		})
	}

	// Update page url using shallow.
	useUpdateEffect(() => {
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	// Reset filters and pagination when route changes
	useEffect(() => {
		current_page_alias == `/${router.locale + router.asPath}` && resetFilterForm()
	}, [router])

	return (
		<>
			<div ref={scrollRefPagination}>
				<form onSubmit={handleSubmit(submitFilterForm)}>
					<div className="flex flex-col items-end gap-5 rounded-xl bg-white p-6 shadow-lg">
						<div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
							<Text className="flex items-center gap-2 text-lg font-semibold">
								<Icon id="control-panel" className="h-4 w-4" />
								{t("Nx:Filtres et recherche")}
							</Text>
							<Button
								id="faq-reset"
								type="button"
								onClick={resetFilterForm}
								variant="filter"
								icon={<Icon id="x" className="h-3 w-3" />}
								className="hidden md:flex"
							>
								{t("Nx:Renitialiser")}
							</Button>
						</div>
						<div className="flex w-full flex-col items-center gap-4 md:flex-row">
							<div className="w-full flex-1">
								<Controller
									name="term"
									control={control}
									render={({ field }) => (
										<SelectNative
											list={context.terms?.faq_section || []}
											onChange={field.onChange}
											onBlur={field.onBlur}
											id="term"
											defaultValue={field.value}
											label={t("Nx:Terms")}
											variant="filter"
											name="term"
										/>
									)}
								/>
							</div>
						</div>
						<div className="flex w-full flex-row items-center justify-center gap-4 md:justify-end">
							<Button id="publication-submit" type="submit" variant="primary">
								{t("Nx:Appliquer")}
							</Button>
							<Button
								id="faq-reset"
								type="button"
								onClick={resetFilterForm}
								variant="filter"
								icon={<Icon id="x" className="h-3 w-3" />}
								className="md:hidden"
							>
								{t("Nx:Renitialiser")}
							</Button>
						</div>
					</div>
				</form>

				<LoadingOverlay active={collection.isLoading} spinner={true}>
					<div className="relative pb-4 pt-4 lg:pb-8 lg:pt-8">
						<Text variant="medium" className="mb-5">{`${collection?.count || 0} ${t(
							"Nx:articles found"
						)}`}</Text>
						{posts.length > 0 ? (
							<>
								{posts.map((post, index) => {
									return (
										<div key={index} className="mb-10">
											{post.title && (
												<Heading variant="3" level={2} className="mb-5">
													{post.title}
												</Heading>
											)}

											{post.description && (
												<Wysiwyg
													html={post.description}
													className="mb-10"
													textVariant="subtitle"
												/>
											)}

											<Accordion
												variant="white"
												openedNodeHandler={(openedNode) => {
													handleOpenedNode(post.title, openedNode)
												}}
												nodes={post.items}
											/>
										</div>
									)
								})}
							</>
						) : (
							<EmptyBlock />
						)}
					</div>
				</LoadingOverlay>
				{parseInt(collection.count) >
					parseInt(filters?.page?.limit || defaultPageLimit) && (
					<Container className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
						<Pagination
							baseUrl={`${paginationShallowUrl.replace(/page=\d+/, "page={page}")}`}
							contentRef={scrollRefPagination}
							pageSize={filters?.page?.limit || defaultPageLimit}
							current={pager}
							total={collection.count}
							isLoading={!collection.isLoading}
							onChange={(page) => setPager(page)}
							id="faq-pagination"
						/>
					</Container>
				)}
			</div>

			{/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
			<Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive">
				{JSON.stringify(faqSchema)}
			</Script>
		</>
	)
}

export default FaqListingWidget
