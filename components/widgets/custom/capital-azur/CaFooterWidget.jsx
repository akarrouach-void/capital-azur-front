import { Link, Icon } from "@/ui"
import { useMenu } from "@vactorynext/core/hooks"

export const config = {
	id: "capital_azur_decoupled:ca-footer",
	lazy: false,
}

/* Inline SVG brand icons — avoids sprite aspect-ratio issues */
const SocialIcon = ({ id, url }) => {
	const detected = id || detectNetwork(url)

	switch (detected) {
		case "linkedin":
			return (
				<svg viewBox="0 0 34 32" className="h-5 w-5 fill-current" aria-hidden="true">
					<path d="M8.215 3.751c0-2.072-1.838-3.751-4.106-3.751-2.27 0-4.109 1.679-4.109 3.751 0 2.070 1.838 3.747 4.109 3.747 2.268 0 4.106-1.677 4.106-3.747zM0.941 31.603h7.368v-21.25h-7.368zM18.65 19.784c0-2.437 1.153-4.82 3.91-4.82s3.435 2.383 3.435 4.762v11.605h7.335v-12.080c0-8.393-4.961-9.839-8.013-9.839-3.049 0-4.731 1.031-6.667 3.531v-2.861h-7.356v21.25h7.356v-11.547z" />
				</svg>
			)
		case "youtube":
			return (
				<svg viewBox="0 0 45 32" className="h-5 w-auto fill-current" aria-hidden="true">
					<path d="M17.95 21.901l-0.001-12.783 12.224 6.414-12.222 6.37zM44.789 6.903c0 0-0.443-3.135-1.798-4.516-1.721-1.813-3.649-1.821-4.533-1.927-6.331-0.461-15.827-0.461-15.827-0.461h-0.020c0 0-9.496 0-15.827 0.461-0.885 0.105-2.812 0.114-4.534 1.927-1.356 1.381-1.797 4.516-1.797 4.516s-0.452 3.682-0.452 7.363v3.452c0 3.682 0.452 7.363 0.452 7.363s0.441 3.135 1.797 4.516c1.722 1.813 3.983 1.756 4.989 1.945 3.619 0.35 15.382 0.458 15.382 0.458s9.506-0.014 15.837-0.475c0.884-0.107 2.812-0.115 4.533-1.928 1.356-1.381 1.798-4.516 1.798-4.516s0.452-3.681 0.452-7.363v-3.452c0-3.681-0.452-7.363-0.452-7.363v0z" />
				</svg>
			)
		case "twitter":
			return (
				<svg viewBox="0 0 39 32" className="h-5 w-auto fill-current" aria-hidden="true">
					<path d="M32.751 2.475c-1.46-1.523-3.515-2.475-5.794-2.475-4.427 0-8.016 3.59-8.016 8.014 0 0.615 0.071 1.214 0.203 1.79-6.006-0.158-12.573-3.167-16.527-8.318-2.431 4.207-0.327 8.887 2.431 10.592-0.944 0.071-2.682-0.109-3.501-0.907-0.055 2.793 1.288 6.493 6.184 7.835-0.943 0.507-2.612 0.362-3.338 0.254 0.255 2.357 3.556 5.439 7.166 5.439-1.287 1.488-6.127 4.188-11.56 3.329 3.689 2.245 7.989 3.545 12.54 3.545 12.933 0 22.977-10.482 22.436-23.412-0.002-0.077 0-0.111 0-0.145 0-0.040-0.003-0.078-0.005-0.117 1.177-0.805 2.757-2.23 3.886-4.104-0.655 0.361-2.618 1.082-4.445 1.262 1.173-0.633 2.91-2.706 3.339-4.354-1.129 0.723-3.721 1.774-5 1.774z" />
				</svg>
			)
		default:
			return <Icon id={id} className="h-5 w-5" />
	}
}

const detectNetwork = (url = "") => {
	if (!url) return null
	if (url.includes("linkedin")) return "linkedin"
	if (url.includes("youtube")) return "youtube"
	if (url.includes("twitter") || url.includes("x.com")) return "twitter"
	if (url.includes("facebook")) return "facebook"
	if (url.includes("instagram")) return "instagram"
	return null
}

const CaFooterWidget = ({ data }) => {
	const extraFields = data?.extra_field || {}
	const components = data?.components || []
	const copyrights = extraFields?.copyrights || "© 2019 CAPITAL AZUR"
	const navItems = useMenu("footer")

	// Social items: components that have cta_social set
	const socialItems = components.filter((c) => c?.cta_social?.url)

	return (
		<footer className="bg-white">
			{/* Top row: social icons left, nav links right */}
			<div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center md:px-12">
				{/* Social icons */}
				{socialItems.length > 0 && (
					<ul className="flex items-center gap-5">
						{socialItems.map((item, i) => (
							<li key={i}>
								<Link
									href={item?.cta_social?.url || "#"}
									target={item?.cta_social?.attributes?.target || "_self"}
									aria-label={item?.cta_social?.title || item?.icon || ""}
									className="text-primary-600 transition-colors hover:text-primary-800"
								>
									<SocialIcon id={item?.icon || null} url={item?.cta_social?.url || ""} />
								</Link>
							</li>
						))}
					</ul>
				)}

				{/* Nav links with pipe separators */}
				{navItems?.length > 0 && (
					<nav>
						<ul className="flex flex-wrap items-center gap-1">
							{navItems.map((item, i) => (
								<li key={i} className="flex items-center">
									{i > 0 && (
										<span className="mx-2 select-none text-gray-300" aria-hidden="true">
											|
										</span>
									)}
									<Link
										href={item.url}
										className="text-sm font-semibold uppercase tracking-wide text-gray-700 transition-colors hover:text-primary-600 hover:underline"
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				)}
			</div>

			<div className="border-t border-gray-200" />

			<div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-6 py-4 md:flex-row md:px-12">
				<p className="text-sm text-primary-600">{copyrights}</p>

				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-400">Conception et développement</span>
					<span className="inline-flex items-center gap-1 rounded bg-primary-600 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-white">
						Void
						<span aria-hidden="true">&#9658;</span>
					</span>
				</div>
			</div>
		</footer>
	)
}

export default CaFooterWidget
