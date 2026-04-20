import { Fragment, useState } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { Transition } from "@headlessui/react"
import { useRouter } from "next/router"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"

export const SearchOverlayV2 = ({ onClose, show }) => {
	const { t } = useI18n()
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
			<div className="fixed left-0 top-0 z-[100] h-screen w-screen bg-black bg-opacity-80">
				<div className="small:px-5 relative flex h-full w-full items-center justify-center px-2 py-5 md:px-10 md:py-10">
					<button
						className="absolute right-10 top-10 bg-transparent text-white"
						onClick={() => {
							onClose()
						}}
					>
						<svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
							<path d="M1.579.181A3.895 3.895 0 0 0 .189 1.57l-.01.018a1.82 1.82 0 0 0 .018 1.595l-.005-.011c.148.314 1.734 1.959 6.385 6.622L12.767 16l-6.19 6.206C1.926 26.868.339 28.514.192 28.828c-.386.818-.191 1.6.593 2.387.787.784 1.568.98 2.387.593.314-.148 1.96-1.734 6.622-6.385L16 19.233l6.206 6.19c4.662 4.651 6.308 6.238 6.622 6.385.818.386 1.6.191 2.387-.593.784-.787.98-1.569.593-2.387-.148-.314-1.734-1.959-6.385-6.622L19.233 16l6.19-6.206c4.651-4.662 6.238-6.308 6.385-6.622.386-.818.191-1.6-.593-2.387-.787-.784-1.569-.98-2.387-.593-.314.148-1.959 1.734-6.622 6.385L16 12.767l-6.206-6.19C5.132 1.926 3.486.339 3.172.192A1.844 1.844 0 0 0 1.567.185L1.578.18z"></path>
						</svg>
					</button>

					<form
						className="mx-auto w-full max-w-screen-md"
						onSubmit={(e) => handleSubmit(e)}
					>
						<div className="small:px-5 small:py-5 flex w-full items-center rounded border border-transparent bg-white px-2 py-2 focus-within:border-primary">
							<svg
								viewBox="0 0 23 24"
								className="h-5 w-5 shrink-0 grow-0 fill-current text-gray-600 md:h-6 md:w-6"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M10.64 3.179a8.154 8.154 0 1 0 5.703 13.98l.006-.006a8.154 8.154 0 0 0-5.71-13.975zm8.198 14.774a10.494 10.494 0 0 0 2.34-6.62c0-5.82-4.719-10.539-10.539-10.539C4.82.794.102 5.512.102 11.332S4.82 21.87 10.639 21.87c2.453 0 4.71-.838 6.5-2.243l3.353 3.243a1.192 1.192 0 1 0 1.657-1.713l-3.31-3.204zM9.4 6.278c0-.658.533-1.192 1.192-1.192a5.484 5.484 0 0 1 5.483 5.483 1.192 1.192 0 0 1-2.384 0 3.1 3.1 0 0 0-3.1-3.099A1.192 1.192 0 0 1 9.4 6.278z"
									fill="currentColor"
								></path>
							</svg>
							<input
								autoFocus
								type="text"
								placeholder={t("Nx:What are you searching for ?")}
								onChange={(e) => setQuery(e.target.value)}
								className="text-md text-dark font-400 min-w-[0] shrink-0 grow basis-0 !border-0 bg-white px-3 py-2 placeholder-gray-600 outline-none !ring-0"
							/>

							<button
								type="submit"
								className="btn btn_primary btn-sm ml-5 shrink-0 grow-0 space-x-2"
							>
								{submitted && (
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white md:h-5 md:w-5"></div>
								)}
								<span>{t("Nx:Recherche")}</span>
							</button>
						</div>

						<span className="font-400 mt-2 block text-sm text-white">
							{t("Nx:Hit enter to search or ESC to close")}
						</span>
					</form>
				</div>
			</div>
		</Transition>
	)
}
