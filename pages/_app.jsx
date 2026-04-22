import { useMemo, useState, useEffect } from "react"
import { CookieComplianceFloated } from "../components/modules/contrib/cookie-compliance-floated/cookie-compliance-floated"
import { FlagBagProvider, useFlags } from "@vactory/console/client"
import dynamic from "next/dynamic"
import { Montserrat, Cairo } from "next/font/google"
import {
	usePageViewTracking,
	useThemeObserver,
	useDocumentClasses,
	usePwaFirstVisit,
	useCookieConsent,
	useUtmParameters,
	useNProgress,
	useAppConfig,
	AppHead,
	AppProviders,
} from "@vactorynext/core/config-client"
import { TourContextProvider } from "@vactorynext/core/context"
import { toast } from "react-toastify"

const montserrat = Montserrat({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	subsets: ["latin"],
	variable: "--font-montserrat",
	preload: true,
})

const cairo = Cairo({
	weight: ["200", "300", "400", "500", "600", "700"],
	display: "swap",
	subsets: ["latin", "arabic"],
	variable: "--font-cairo",
	preload: true,
})

// Lazy load OneSignal - not needed for initial render
const OneSignalPushNotificationInitializer = dynamic(
	() =>
		import("../components/modules/contrib/onesignal/onesignal").then(
			(mod) => mod.OneSignalPushNotificationInitializer
		),
	{ ssr: false }
)

// Dynamically import heavy components to reduce initial bundle
const ToastContainer = dynamic(
	() => import("react-toastify").then((mod) => mod.ToastContainer),
	{ ssr: false }
)

// Dev tools - only load when needed
const ScreenStats = dynamic(() => import("@/ui").then((mod) => mod.ScreenStats), {
	ssr: false,
})

// Load CSS only on client side
if (globalThis.window !== undefined) {
	import("react-toastify/dist/ReactToastify.css")
	import("react-json-view-lite/dist/index.css")
}

const Layout = ({ getLayout, Component, pageProps, theme }) => {
	return getLayout(<Component {...pageProps} />, theme)
}

export default function App({ Component, pageProps }) {
	// Retrieves app configuration values: theme is the current theme, and getLayout is a function to get the layout for the component.
	const { theme, getLayout } = useAppConfig({
		Component,
		pageProps,
		toast,
	})

	// Pass the color to the NProgress with important sign '!', default is !bg-primary
	useNProgress("!bg-primary")

	// Setup effects
	// Track page views for analytics
	usePageViewTracking()

	// Handle theme changes and trigger page reload when theme changes
	useThemeObserver()

	// Set body and html classes from document properties
	useDocumentClasses(pageProps?.document)

	// Track first visit to PWA version and send analytics
	usePwaFirstVisit()

	// Handle cookie consent and send analytics when marketing cookies accepted
	useCookieConsent()

	// Store and manage UTM parameters for campaign tracking
	useUtmParameters()

	// Dynamically load tour module (code-split)
	const [tourModule, setTourModule] = useState(null)
	useEffect(() => {
		import("../components/modules/contrib/tour").then(setTourModule)
	}, [])

	// Memoize extraProviders to prevent recreation on every render
	const extraProviders = useMemo(() => {
		if (!tourModule) return []
		const { Close, Badge, Navigation, Content, styles } = tourModule
		return [
			{
				component: TourContextProvider,
				props: {
					components: { Badge, Close, Navigation, Content },
					styles,
				},
			},
		]
	}, [tourModule])

	return (
		<>
			{/* Font family configuration based on locale */}
			{pageProps.locale === "ar" ? (
				<style jsx global>{`
					:root {
						--rtl-font-family: ${cairo.style.fontFamily};
					}
				`}</style>
			) : (
				<style jsx global>{`
					:root {
						--sans-font-family: ${montserrat.style.fontFamily};
					}
				`}</style>
			)}

			{/* Flag management provider wrapper */}
			<FlagBagProvider value={pageProps?.flags || {}}>
				<div id="theme-selector" data-theme={pageProps?.node?._theme} />

				{/* Analytics and meta components */}
				<AppHead
					pageProps={pageProps}
					/* Below is an example on how to pass custom meta tags, link tags and script tags */
					customTags={
						{
							/*
						meta: { author: "Void" },
						link: [{ rel: "canonical", href: "https://yoursite.com" }],
						*/
						}
					}
				>
					{/* Any other custom head elements */}
				</AppHead>

				{/* Main app providers wrapper */}
				<AppProviders
					pageProps={pageProps}
					useFlags={useFlags}
					ToastContainer={ToastContainer}
					extraProviders={extraProviders}
				>
					{/* Main content with layout */}
					<Layout
						getLayout={getLayout}
						Component={Component}
						pageProps={pageProps}
						theme={theme}
					>
						<Component {...pageProps} />
					</Layout>

					{/* Cookie consent banner */}
					<CookieComplianceFloated
						body="We use cookies to improve your experience. By continuing, you agree to our cookie policy."
						actionLabel="Accept All"
						declineLabel="Decline"
						cookieLifeTime={365}
						privacyPolicy={{ href: "/en/privacy-policy", title: "Privacy Policy" }}
					/>

					{/* Additional functionality */}
					<OneSignalPushNotificationInitializer />
				</AppProviders>

				{/* Utility components */}
				<ScreenStats />
			</FlagBagProvider>
		</>
	)
}
