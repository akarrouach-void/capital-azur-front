import { useNode } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { Link } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:page-anchor-nav",
}

const PageAnchorNavWidget = () => {
	const { blocs } = useNode()
	const router = useRouter()
	const activeHash = router.asPath.split("#")[1] ?? ""

	const tabs = blocs.field_vactory_paragraphs
		.filter((p) => {
			const isTargetWidget = config.id === p.field_vactory_component.widget_id
			return !isTargetWidget && p.paragraph_identifier
		})
		.map((p) => ({
			anchor: p.paragraph_identifier,
			label: p.field_vactory_title,
		}))

	if (!tabs.length) return null

	return (
		<nav className="sticky top-12 z-[9999] w-full" aria-label="Page sections">
			<div className="scrollbar-hide mx-auto flex max-w-6xl overflow-x-auto border-b border-gray-200">
				{tabs.map((tab) => {
					const isActive = activeHash === tab.anchor || (!activeHash && tab === tabs[0])
					return (
						<Link
							key={tab.anchor}
							href={`#${tab.anchor}`}
							aria-current={isActive ? "page" : undefined}
							className={[
								"shrink-0 border-b-2 px-8 py-5 text-xs font-semibold uppercase tracking-widest transition-colors duration-200",
								isActive
									? "border-blue-600 text-blue-600"
									: "border-transparent text-gray-400 hover:text-gray-700",
							].join(" ")}
						>
							{tab.label}
						</Link>
					)
				})}
			</div>
		</nav>
	)
}

export default PageAnchorNavWidget
