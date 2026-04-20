import { useRouter } from "next/router"
import { Fragment, useRef } from "react"
import { useNode } from "@vactorynext/core/hooks"
import { dlPush, getEnabledLanguages } from "@vactorynext/core/lib"
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react"
import { Icon } from "@/ui"

const languages = getEnabledLanguages({
	withLabels: true,
})

const SwitchLocale = () => {
	const router = useRouter()
	const locale = router.locale
	const { path_18n } = useNode()
	const menuButtonRef = useRef(null)

	// trigger data layer event when switching language
	const handleLangSwitch = (language) => {
		dlPush("Sélection langue", {
			Langue: language.code,
		})
		menuButtonRef?.current?.click()
	}

	// Filter out the current locale from the languages
	const availableLanguages = languages.filter(
		(language) => path_18n[language.code] && language.code !== locale
	)

	// Don't show the locale switcher if no other languages are available
	if (availableLanguages.length === 0) return null

	return (
		<Menu as="div" className="relative inline-block text-left" id="switch-locale-button">
			{({ open }) => (
				<>
					<div>
						<MenuButton
							className="animate inline-flex w-full items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
							data-testid="switch-locale-button"
						>
							{locale.toUpperCase()}
							<Icon
								id={open ? "chevron-up" : "chevron-down"}
								className="-mr-1 ml-2 h-2 w-2"
								aria-hidden="true"
							/>
						</MenuButton>
					</div>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<MenuItems className="absolute right-0 top-full z-50 mt-2 w-24 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-800">
							<div className="py-1">
								{availableLanguages.map((language) => {
									const url = path_18n[language.code]
									if (!url) return null
									return (
										<MenuItem key={language.code} as="div">
											{({ active }) => {
												return (
													<a
														onClick={() => {
															handleLangSwitch(language)
														}}
														locale={false}
														href={url}
														className={`flex w-full items-center space-x-2 px-4 py-2 text-left text-sm transition-colors ${
															active ? "hover:bg-gray-100 dark:hover:bg-gray-700" : ""
														} ${
															language.code === locale
																? "bg-gray-50 dark:bg-gray-600"
																: ""
														}`}
														data-testid={`switch-locale-item-${language.code}`}
													>
														<span className="text-gray-700 dark:text-gray-300">
															{language.label}
														</span>
													</a>
												)
											}}
										</MenuItem>
									)
								})}
							</div>
						</MenuItems>
					</Transition>
				</>
			)}
		</Menu>
	)
}

export default SwitchLocale
