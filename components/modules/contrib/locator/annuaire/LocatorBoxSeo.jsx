import { useState } from "react"
import { drupal } from "@vactorynext/core/drupal"
import { Link, LoadingOverlay, Heading, Text, Icon } from "@/ui"

import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"

const LocatorBoxSeo = ({ city, seoGrouping }) => {
	const [grouping, setGrouping] = useState(seoGrouping || [])
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const { profile } = useAccount()
	const locale = router.locale
	const { t } = useI18n()

	const fetchGrouping = async () => {
		const controller = new AbortController()
		setIsLoading(true)

		try {
			let endpoint = `${locale}/api/store-locator/grouping`
			if (city) {
				endpoint = `${endpoint}?city=${city}`
			}
			const response = await drupal.fetch(`${endpoint}`, {
				withAuth: true,
				headers: {
					"X-Auth-Provider": profile?.provider,
				},
				signal: controller.signal,
			})
			const data = await response.json()

			setIsLoading(false)
			setGrouping(data?.resources || [])
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}

		return () => controller.abort()
	}

	useUpdateEffect(() => {
		fetchGrouping()
	}, [city])

	return (
		<div className="rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm md:px-10 md:py-12">
			<LoadingOverlay active={isLoading} spinner={true}>
				<div className="text-center">
					<div className="mb-6 flex flex-col items-center gap-3">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
							<Icon id="locator" className="h-6 w-6 text-primary-600" />
						</div>
						<Heading level={3} className="text-gray-900">
							{t("Nx:You may wanna check")}
						</Heading>
						{city && (
							<Text className="text-sm text-gray-600">
								{t("Nx:Discover more locations")}
							</Text>
						)}
					</div>

					{grouping.length > 0 ? (
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{grouping.map((item) => {
								const url = `${router.pathname}?locality=${item.name}`
								const label = t(`Agences à ${item.name}`)
								return (
									<div key={item.tid}>
										{item.name && (
											<Link
												href={url}
												className="group block rounded-lg border border-gray-200 bg-gray-50 p-4 text-left transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-md"
											>
												<div className="flex items-center gap-3">
													<Icon
														id="locator"
														className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-primary-500"
													/>
													<Text className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
														{label}
													</Text>
												</div>
											</Link>
										)}
									</div>
								)
							})}
						</div>
					) : (
						!isLoading && (
							<div className="py-8">
								<Text className="text-gray-500">{t("Nx:No suggestions available")}</Text>
							</div>
						)
					)}
				</div>
			</LoadingOverlay>
		</div>
	)
}

export const LocatorBoxSeoInit = async (data, context) => {
	const { session, locale } = data.props
	const { city } = context.query

	let items = []
	let endpoint = `${locale}/api/store-locator/grouping`
	if (city) {
		endpoint = `${endpoint}&city=${city}`
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
		return items
	} catch {
		// Do nothing.
	}
	data.props.seoGrouping = items || []
}

export default LocatorBoxSeo
