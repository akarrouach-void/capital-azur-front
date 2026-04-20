import get from "lodash.get"
import { Tooltip, Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:36",
}

export const ToolBoxItem = ({ props }) => {
	return (
		<>
			<Tooltip className="max-lg:hidden" position="leftCenter" text={props.cta.title}>
				<Link
					id={props.cta.id}
					href={props.cta.href}
					target={props.cta.target}
					rel={props.cta.rel}
					className={vclsx(
						props.cta.className,
						"flex flex-col items-center justify-center gap-2 bg-black/90 p-4 hover:bg-primary-400 lg:rounded-bl-lg lg:rounded-tl-lg lg:shadow-lg"
					)}
				>
					<span className="inline-flex items-center">
						<Icon id={props.icon} className="h-4 w-4 text-white" />
					</span>
					<span className="text-xs text-white lg:hidden">{props.titleMobile}</span>
				</Link>
			</Tooltip>
		</>
	)
}

export const ToolboxButton = ({ props }) => {
	return (
		<>
			<Link
				id={props.cta.id}
				href={props.cta.href}
				target={props.cta.target}
				rel={props.cta.rel}
				className={vclsx(
					props.cta.className,
					"flex items-center justify-center rounded-bl-md rounded-tl-md border border-success-300 bg-success-300 px-6 py-4 text-center text-white shadow-[-5px_6px_19px_-1px_#b6bec9] hover:bg-white hover:text-black"
				)}
			>
				<span className="inline-block w-2 whitespace-pre-wrap break-words">
					{props.cta.title}
				</span>
			</Link>
		</>
	)
}

const ToolBoxContainer = ({ data }) => {
	const props = {
		items: data?.components?.map((item) => ({
			isButton: get(item, "active_button", false),
			icon: get(item, "idIcon", ""),
			titleMobile: get(item, "label", ""),
			cta: {
				href: get(item, "link.url", ""),
				title: get(item, "link.title", ""),
				id: get(item, "link.attributes.id", ""),
				className: get(item, "link.attributes.class", ""),
				target: get(item, "link.attributes.target", ""),
				rel: get(item, "link.attributes.rel", ""),
			},
		})),
	}

	return (
		<>
			<div className="lg:fixed lg:right-0 lg:top-[200px] lg:z-30 lg:flex lg:flex-col lg:items-end">
				<ul className="max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:flex">
					{props.items.map((item, index) => {
						if (!item.isButton) {
							return (
								<li key={index} className="lg:mb-2 max-lg:shrink-0 max-lg:grow">
									<ToolBoxItem props={item} />
								</li>
							)
						}
					})}
				</ul>
				<ul className="max-lg:fixed max-lg:right-0 max-lg:top-[200px] max-lg:z-30 max-lg:flex max-lg:flex-col max-lg:items-end">
					{props.items.map((item, index) => {
						if (item.isButton) {
							return (
								<li key={index} className={"my-10"}>
									<ToolboxButton props={item} />
								</li>
							)
						}
					})}
				</ul>
			</div>
		</>
	)
}

export default ToolBoxContainer
