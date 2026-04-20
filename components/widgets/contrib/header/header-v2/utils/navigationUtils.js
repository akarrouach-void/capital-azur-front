// Navigation utility functions and constants

export const colorVariants = [
	{ bg: "bg-primary-100", text: "text-primary-600" },
	{ bg: "bg-green-100", text: "text-green-600" },
	{ bg: "bg-purple-100", text: "text-purple-600" },
	{ bg: "bg-blue-100", text: "text-blue-600" },
	{ bg: "bg-indigo-100", text: "text-indigo-600" },
	{ bg: "bg-pink-100", text: "text-pink-600" },
	{ bg: "bg-orange-100", text: "text-orange-600" },
	{ bg: "bg-teal-100", text: "text-teal-600" },
	{ bg: "bg-red-100", text: "text-red-600" },
	{ bg: "bg-yellow-100", text: "text-yellow-600" },
]

export const getColorVariant = (index) => {
	return colorVariants[index % colorVariants.length]
}

export const createIsActiveLink = (currentPath, locale) => {
	return (url) => {
		if (!url) return false
		// Remove locale prefix from current path for comparison
		const pathWithoutLocale = currentPath.replace(`/${locale}`, "") || "/"
		const urlWithoutLocale = url.replace(`/${locale}`, "") || "/"
		return (
			pathWithoutLocale === urlWithoutLocale ||
			pathWithoutLocale.startsWith(urlWithoutLocale + "/")
		)
	}
}

export const hasActiveChildAtAnyLevel = (link, isActiveLink) => {
	return link.below?.some(
		(submenu) =>
			isActiveLink(submenu.url) ||
			submenu.below?.some(
				(subSubmenu) =>
					isActiveLink(subSubmenu.url) ||
					subSubmenu.below?.some((level4Item) => isActiveLink(level4Item.url))
			)
	)
}

export const hasActiveChildAtLevel2 = (submenu, isActiveLink) => {
	return submenu.below?.some((subSubmenu) => isActiveLink(subSubmenu.url))
}
