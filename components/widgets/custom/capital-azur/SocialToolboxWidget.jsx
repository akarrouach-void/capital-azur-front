import { Icon, Link } from "@/ui"
import { useMenu } from "@vactorynext/core/hooks"

export const config = {
	id: "capital_azur_decoupled:social-toolbox",
}

const SocialToolboxWidget = () => {
	const items = useMenu("toolbox")

	if (!items.length) return null

	return (
		<div className="fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
			<ul className="flex flex-col items-center gap-0 overflow-hidden rounded-r-2xl bg-main py-2">
				{items.map((item) => {
					const icon = item?.options?.icon || item?.title?.toLowerCase() || ""
					const url = item?.url || "#"
					const title = item?.title || ""
					const attributes = item?.options?.attributes || {}

					return (
						<li key={item.id}>
							<Link
								href={url}
								title={title}
								target={attributes?.target || "_blank"}
								rel={attributes?.rel || "noopener noreferrer"}
								className="flex h-14 w-14 items-center justify-center text-white transition-opacity hover:opacity-80"
							>
								{icon ? (
									<Icon id={icon} className="h-6 w-6" />
								) : (
									<span className="text-xs font-bold uppercase">{title.slice(0, 2)}</span>
								)}
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default SocialToolboxWidget
