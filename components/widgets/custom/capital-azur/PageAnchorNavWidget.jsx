import { useState, useEffect, useRef } from "react"
import { useNode } from "@vactorynext/core/hooks"
import { Link } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:page-anchor-nav",
}

const PageAnchorNavWidget = () => {
	const { blocs } = useNode()

	const tabs = blocs.field_vactory_paragraphs
		.filter((p) => config.id !== p.field_vactory_component.widget_id && p.paragraph_identifier)
		.map((p) => ({ anchor: p.paragraph_identifier, label: p.field_vactory_title }))

	const [activeId, setActiveId] = useState(tabs[0]?.anchor ?? "")
	const [isSticky, setIsSticky] = useState(false)
	const sentinelRef = useRef(null)

	useEffect(() => {
		const sentinel = sentinelRef.current
		if (!sentinel) return

		const observer = new IntersectionObserver(
			([entry]) => setIsSticky(!entry.isIntersecting),
			{ threshold: 0 }
		)
		observer.observe(sentinel)

		const handleScroll = () => {
			for (let i = tabs.length - 1; i >= 0; i--) {
				const el = document.getElementById(tabs[i].anchor)
				if (el && el.getBoundingClientRect().top <= 120) {
					setActiveId((prev) => (prev === tabs[i].anchor ? prev : tabs[i].anchor))
					return
				}
			}
		}
		window.addEventListener("scroll", handleScroll, { passive: true })

		return () => {
			observer.disconnect()
			window.removeEventListener("scroll", handleScroll)
		}
	}, [tabs])

	if (!tabs.length) return null

	return (
		<div className="relative">
			<div ref={sentinelRef} className="h-px" aria-hidden="true" />
			<nav
				aria-label="Page sections"
				className={`w-full border-b border-gray-200 bg-white z-30 ${isSticky ? "fixed top-0 left-0 right-0 shadow-sm" : ""}`}
			>
				<div className="scrollbar-hide mx-auto flex max-w-5xl overflow-x-auto px-6 lg:px-16">
					{tabs.map((tab) => {
						const isActive = activeId === tab.anchor
						return (
							<Link
								key={tab.anchor}
								href={`#${tab.anchor}`}
								aria-current={isActive ? "page" : undefined}
								className={`shrink-0 px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${
									isActive ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400 hover:text-gray-700"
								}`}
							>
								{tab.label}
							</Link>
						)
					})}
				</div>
			</nav>
		</div>
	)
}

export default PageAnchorNavWidget
