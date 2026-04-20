import { useState } from "react"
import { Image, Link, Icon } from "@/ui"
import { usePathname } from "next/navigation"
import { useMenu } from "@vactorynext/core/hooks"

export const config = {
	id: "capital_azur_decoupled:ca-header",
	lazy: false,
}

const CaHeaderWidget = ({ data }) => {
	const path = usePathname()
	const [mobileOpen, setMobileOpen] = useState(false)

	const extraFields = data?.extra_field || {}
	const logoSrc = extraFields?.logo?.[0]?._default || null
	const logoWidth = extraFields?.logo?.[0]?.meta?.width || 160
	const logoHeight = extraFields?.logo?.[0]?.meta?.height || 48
	const logoAlt = extraFields?.logo?.[0]?.meta?.alt || "Capital Azur"
	const ctaUrl = extraFields?.cta?.url || null
	const ctaTitle = extraFields?.cta?.title || null
	const ctaIcon = extraFields?.cta?.attributes?.class || null

	const navItems = useMenu("main")

	console.log(navItems)

	const isActive = (url) => {
		if (!url || url === "#") return false

		if (path === "/") return url === "/"
		return url.includes(path) || path.includes(url)
	}

	return (
		<header className="w-full border-b-2 border-white bg-white shadow-sm">
			<div className="mx-auto flex h-[88px] max-w-[1400px] items-center justify-between px-6 md:px-12">
				{/* Logo */}
				<Link href="/" className="shrink-0">
					{logoSrc ? (
						<Image
							src={logoSrc}
							width={logoWidth}
							height={logoHeight}
							alt={logoAlt}
							className="h-12 w-auto object-contain"
						/>
					) : (
						<span className="text-xl font-extrabold uppercase tracking-widest text-[#1c2e5e]">
							Capital Azur
						</span>
					)}
				</Link>

				<div className="flex items-center gap-4">
					{/* Desktop nav */}
					<nav className="hidden items-center md:flex">
						{navItems.map((item, i) => (
							<div key={i} className="flex items-center">
								{i > 0 && (
									<span className="select-none px-1 text-gray-300" aria-hidden="true">
										|
									</span>
								)}
								<Link
									href={item.url}
									className={
										isActive(item.url)
											? "px-3 py-2 text-sm font-semibold uppercase tracking-wide text-primary-600 transition-colors"
											: "px-3 py-2 text-sm font-semibold uppercase tracking-wide text-gray-700 transition-colors hover:text-primary-600"
									}
								>
									{item.title}
								</Link>
							</div>
						))}
					</nav>

					{/* CTA + mobile burger */}
					<div className="flex items-center gap-4">
						{ctaUrl && ctaTitle && (
							<Link
								href={ctaUrl}
								className="hidden items-center gap-2 rounded-md bg-[#1c2e5e] px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#162348] md:inline-flex"
							>
								{ctaTitle}
								{ctaIcon && <Icon id={ctaIcon} className="h-4 w-4" />}
							</Link>
						)}

						{/* Mobile burger */}
						<button
							className="flex flex-col gap-1.5 p-2 md:hidden"
							onClick={() => setMobileOpen((o) => !o)}
							aria-label="Toggle menu"
						>
							<span className="block h-0.5 w-6 bg-gray-700" />
							<span className="block h-0.5 w-6 bg-gray-700" />
							<span className="block h-0.5 w-6 bg-gray-700" />
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{mobileOpen && (
				<nav className="border-t border-gray-100 bg-white px-6 pb-6 md:hidden">
					<ul className="flex flex-col gap-4 pt-4">
						{navItems.map((item, i) => (
							<li key={i}>
								<Link
									href={item.url}
									className={
										isActive(item.url)
											? "block text-sm font-semibold uppercase tracking-wider text-primary-600 transition-colors"
											: "block text-sm font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:text-primary-600"
									}
									onClick={() => setMobileOpen(false)}
								>
									{item.title}
								</Link>
							</li>
						))}
						{ctaUrl && ctaTitle && (
							<li>
								<Link
									href={ctaUrl}
									className="mt-2 inline-flex items-center gap-2 rounded-md bg-[#1c2e5e] px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#162348]"
								>
									{ctaTitle}
									{ctaIcon && <Icon id={ctaIcon} className="h-4 w-4" />}
								</Link>
							</li>
						)}
					</ul>
				</nav>
			)}
		</header>
	)
}

export default CaHeaderWidget
