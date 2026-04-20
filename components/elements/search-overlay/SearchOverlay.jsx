import { Fragment, useState, useEffect } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { Icon, Input, Button, Link, Heading } from "@/ui"
import { Transition } from "@headlessui/react"
import { drupal } from "@vactorynext/core/drupal"
import { useRouter } from "next/router"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"

export const SearchOverlay = ({ onClose, show }) => {
	const { t } = useI18n()
	const { activeLocale: currentLanguage } = useI18n()
	const [terms, setTerms] = useState([])
	const [submitted, setSubmitted] = useState(false)
	const [query, setQuery] = useState("")
	const router = useRouter()

	const handleSubmit = (e) => {
		e.preventDefault()
		setSubmitted(true)
		router
			.push({
				pathname: `${SYSTEM_ROUTES.search.path}`,
				query: { q: query },
			})
			.then(() => {
				let _timer = setTimeout(() => {
					onClose()
					setSubmitted(false)
					clearTimeout(_timer)
				}, 500)
			})
	}
	useEffect(() => {
		if (show) {
			const frequentSearches = async () => {
				const response = await drupal.fetch(
					`/${router.locale}/frequent-searches?index=default_content_index&limit=10&lang=${currentLanguage}`
				)
				const keywords = await response.json()
				setTerms(keywords.keywords)
			}
			frequentSearches()
		}
	}, [show, currentLanguage])

	return (
		<Transition
			as={Fragment}
			show={show}
			enter="transition-opacity duration-800"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-800"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="fixed left-0 top-0 z-[95] h-screen w-screen bg-gray-500">
				<div className="flex  h-full w-full items-center justify-center px-12">
					<Button
						className="absolute right-8 top-8 border-0 bg-transparent text-black hover:bg-transparent"
						onClick={() => {
							onClose()
						}}
					>
						<Icon id="x" className="h-12 w-12 text-white"></Icon>
					</Button>
					<form
						className="mx-auto w-full max-w-screen-md"
						onSubmit={(e) => handleSubmit(e)}
					>
						<div className="flex items-start gap-5">
							<Input
								variant="overlay"
								//prefix={<Icon id="search" className="w-5 h-5 text-white"></Icon>}
								placeholder={t("Nx:What are you searching for ?")}
								description={t("Nx:Hit enter to search or ESC to close")}
								onChange={(e) => setQuery(e.target.value)}
							/>
							<Button type="submit" variant="secondary" outline={true} className="!px-4">
								{submitted ? (
									<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
								) : (
									<Icon id="search" className="h-5 w-5 text-white" />
								)}
							</Button>
						</div>
						<Heading level="6" className="text-white">
							{t("Nx:Can we suggest?")}
						</Heading>
						{terms.length > 0 && (
							<ul className="flex flex-row flex-wrap gap-x-1 gap-y-1">
								{terms.map((e) => (
									<li key={e.id}>
										<Link
											onClick={() => onClose()}
											href={`${SYSTEM_ROUTES.search.path}?q=${e.keywords}`}
											className="cursor-pointer border border-white border-opacity-50 bg-white bg-opacity-20 px-2 py-1 text-xs font-bold uppercase leading-none text-white"
										>
											{`#${e.keywords}`}
										</Link>
									</li>
								))}
							</ul>
						)}
					</form>
				</div>
			</div>
		</Transition>
	)
}
