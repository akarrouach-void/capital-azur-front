import dynamic from "next/dynamic"

// todo: auto-collect themes at runtime.
// Other themes need to be lazy loaded so their CSS don't conflict.
const LayoutDefault = dynamic(() => import("@/themes/default").then((mod) => mod.Layout))
const LayoutAlt = dynamic(() => import("@/themes/alt").then((mod) => mod.Layout))

const THEMES = {
	alt: LayoutAlt,
	default: LayoutDefault,
}

const loadThemeLayout = (theme) => {
	const Layout = THEMES[theme]

	if (!Layout) {
		const errorMessage = `[loadThemeLayout] Could not find theme "${theme}". Please use one of the following available themes "${Object.keys(
			THEMES
		).join(",")}" or create your own.`
		throw new Error(errorMessage)
	}

	return Layout
}

export default loadThemeLayout
