import { Link, Heading, Button, Input, Icon } from "@/ui"
import React, { useState } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { drupal } from "@vactorynext/core/drupal"

export const config = {
	id: "vactory_help_center:search",
}

const HelpCenterSearchWidget = ({ data }) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const [items, setItems] = useState(data?.components[0]?.help_center_search)
	const [inputValue, setInputValue] = useState(router.query["help-center-keyword"])

	const fetchData = async () => {
		const controller = new AbortController()

		try {
			const response = await drupal.fetch(
				`${locale}/api/help-center-search?keyword=${inputValue}`,
				{
					signal: controller.signal,
				}
			)
			const data = await response.json()

			setItems(data)
			router.push({
				pathname: router.pathname,
				query: { ...router.query, "help-center-keyword": inputValue },
			})
		} catch (err) {
			console.error(err)
		}

		return () => controller.abort()
	}

	const onSubmit = (e) => {
		e.preventDefault()
		fetchData()
	}

	return (
		<>
			<form className="mt-8 flex max-w-xl items-start">
				<Input
					variant="search"
					prefix={
						<Icon id="search" className="h-4 w-4 text-gray active:text-gray"></Icon>
					}
					hasError={inputValue?.length === 0}
					errorMessage={t("Nx:Keyword is required")}
					placeholder={t("Nx:What are you searching for ?")}
					onChange={(e) => setInputValue(e.target.value)}
					value={inputValue}
				/>

				<Button
					type="submit"
					variant="primary"
					className="ml-2"
					onClick={(e) => onSubmit(e)}
				>
					{t("Nx:Submit")}
				</Button>
			</form>
			{items?.map((item) => (
				<li
					key={item.url}
					className="mb-5 flex flex-col gap-5 rounded-md border border-primary-200 p-5 shadow-md lg:flex-row lg:content-center lg:items-center lg:justify-between lg:px-6 lg:py-8"
				>
					<div className="relative mb-2 focus-within:ring-2 focus-within:ring-primary-500">
						<Heading variant={5}>
							<Link href={item.alias}>
								{/* Extend touch target to entire panel */}
								<span className="absolute inset-0" aria-hidden="true" />
								{item.title}
							</Link>
						</Heading>
					</div>
					<Link href={item.url} variant="permalink" className="shrink-0">
						{t("Nx:Lire plus")}
					</Link>
				</li>
			))}
		</>
	)
}

export default HelpCenterSearchWidget
