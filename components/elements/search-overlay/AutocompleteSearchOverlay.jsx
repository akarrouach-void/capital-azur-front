import { Fragment, useEffect, useState } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { Icon, AutocompleteApi, Button, Text, Heading } from "@/ui"
import { Transition } from "@headlessui/react"
import { useRouter } from "next/router"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { useForm } from "react-hook-form"

export const AutocompleteSearchOverlay = ({ onClose, show }) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const [query, setQuery] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [showEmptyMessage, setShowEmptyMessage] = useState(false)

	// Still need react-hook-form for AutocompleteApi component
	const { control } = useForm({
		defaultValues: {
			keyword: "",
		},
	})

	const handleSubmit = (e) => {
		e.preventDefault()

		// Check if query is empty
		if (!query.trim()) {
			setShowEmptyMessage(true)
			// Hide message after 3 seconds
			setTimeout(() => {
				setShowEmptyMessage(false)
			}, 3000)
			return
		}

		setSubmitted(true)
		setShowEmptyMessage(false)
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

	// Handle ESC key press only - let form handle Enter naturally
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.keyCode === 27) {
				onClose()
			}
		}

		if (show) {
			document.addEventListener("keydown", handleKeyDown, false)
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown, false)
		}
	}, [show, onClose])

	return (
		<Transition
			as={Fragment}
			show={show}
			enter="transition-all duration-300 ease-out"
			enterFrom="opacity-0 scale-95"
			enterTo="opacity-100 scale-100"
			leave="animate ease-in"
			leaveFrom="opacity-100 scale-100"
			leaveTo="opacity-0 scale-95"
		>
			<div
				className="fixed left-0 top-0 z-[95] h-screen w-screen bg-black/80 backdrop-blur-sm"
				data-testid="search-autocomplete-overlay"
			>
				<div className="flex h-full w-full items-center justify-center px-4 py-8">
					<Button
						className="absolute right-6 top-6 z-10 border-0 bg-transparent hover:scale-110 hover:bg-transparent hover:text-white"
						icon={<Icon id="x" className="h-6 w-6" />}
						onClick={() => {
							onClose()
						}}
					/>

					<div className="w-full max-w-2xl">
						{/* Header */}
						<div className="mb-8 text-center">
							<Heading level={4} className="mb-2 text-white">
								{t("Nx:What are you searching for ?")}
							</Heading>
							<Text className="text-base text-gray-300 lg:text-lg">
								{t("Nx:Start typing to search across our content")}
							</Text>
						</div>

						{/* Search Form */}
						<form onSubmit={handleSubmit}>
							<div className="relative rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
								<AutocompleteApi
									name="keyword"
									endpoint={`${locale}/search_api_autocomplete/vactory_search`}
									control={control}
									placeholder={t("Nx:What are you searching for ?")}
									queryName="q"
									keyValue="value"
									minLength={3}
									label={t("Nx:What are you searching for ?")}
									onChange={(value) => {
										setQuery(value)
										// Clear empty message when user starts typing
										if (showEmptyMessage) {
											setShowEmptyMessage(false)
										}
									}}
									onKeyDown={(event) => {
										if (event.key === "Enter") {
											event.preventDefault()
											handleSubmit(event)
										}
									}}
									data-testid="search-input-autocomplete"
								/>

								{/* Empty input message */}
								{showEmptyMessage && (
									<div className="mt-4 animate-pulse rounded-lg border border-warning-200 bg-warning-50 p-3">
										<div className="flex items-center gap-2">
											<svg
												className="h-5 w-5 flex-shrink-0 text-warning-600"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											<Text className="text-sm font-medium text-warning-700">
												{t("Nx:Please enter a search term")}
											</Text>
										</div>
									</div>
								)}

								<div className="mt-6 flex flex-col items-center justify-between gap-4 lg:flex-row">
									<Button
										type="submit"
										variant="gradient"
										icon={
											submitted ? (
												<div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
											) : (
												<Icon id="search" className="h-4 w-4" />
											)
										}
										data-testid="search-button-autocomplete"
									>
										{submitted ? t("Nx:Searching...") : t("Nx:Search")}
									</Button>
									<div className="text-center">
										<Text className="flex items-center justify-center gap-2 text-sm text-gray-400">
											<Text
												as="span"
												className="rounded bg-gray-700 px-2 py-1 text-xs text-white"
											>
												ENTER
											</Text>
											{t("Nx:to search")}
											<Text
												as="span"
												className="rounded bg-gray-700 px-2 py-1 text-xs text-white"
											>
												ESC
											</Text>
											{t("Nx:to close")}
										</Text>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Transition>
	)
}
