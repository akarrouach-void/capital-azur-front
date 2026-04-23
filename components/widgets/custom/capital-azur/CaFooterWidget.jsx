import { Link, Icon } from "@/ui"
import { useMenu } from "@vactorynext/core/hooks"

export const config = {
	id: "capital_azur_decoupled:ca-footer",
	lazy: false,
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
									className="text-main transition-colors hover:text-primary-800"
								>
									<Icon
										id={item?.icon || detectNetwork(item?.cta_social?.url || "")}
										className="h-5 w-5"
									/>
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
										className="text-sm font-semibold uppercase tracking-wide text-gray-700 transition-colors hover:text-main hover:underline"
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
				<p className="text-sm text-main">{copyrights}</p>

				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-400">Conception et développement</span>
					<span className="inline-flex items-center gap-1 rounded bg-main px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-white">
						Void
						<span aria-hidden="true">&#9658;</span>
					</span>
				</div>
			</div>
		</footer>
	)
}

export default CaFooterWidget
