import { Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:20",
}

export const ToolBox = ({ hasDescription, items, className = "" }) => {
	return (
		<div
			className={vclsx(
				"max-sm:hidden",
				"fixed top-[200px] z-10",
				hasDescription ? "left-[calc(100%-70px)]" : "left-[calc(100%-40px)]",
				className
			)}
		>
			<ul className="flex flex-col items-start">
				{items.map((item) => {
					return (
						<li
							key={item.id}
							className={vclsx(
								"animate group mb-2 translate-x-0 rounded-bl-lg rounded-tl-lg bg-white text-black shadow hover:bg-gradient hover:text-white",
								!hasDescription
									? "whitespace-nowrap hover:translate-x-[calc(-100%+40px)] rtl:hover:translate-x-[calc(100%-40px)]"
									: "hover:translate-x-[calc(-100%+70px)] rtl:hover:translate-x-[calc(100%-70px)]"
							)}
						>
							<Link
								id={item.id}
								target={item.target}
								href={item.url}
								rel={item.rel}
								className={vclsx("flex flex-row items-center text-sm", item.className)}
							>
								<span
									className={vclsx(
										"inline-flex shrink-0 items-center justify-center  border-r border-white",
										hasDescription
											? "h-[70px] w-[70px] flex-col gap-1 p-2"
											: "h-10 w-10 p-1"
									)}
								>
									<Icon id={item.icon} className="h-4 w-4 shrink-0" />
									{hasDescription && (
										<span className="text-center text-xs">{item.title}</span>
									)}
								</span>
								{hasDescription ? (
									<span className="inline-block w-[300px] p-2">{item.description}</span>
								) : (
									<span className="inline-block whitespace-nowrap p-2">{item.title}</span>
								)}
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

const ToolBoxContainer = ({ data }) => {
	const props = {
		hasDescription: data?.extra_field?.mode ? true : false,
		items: data?.components?.map((item) => ({
			icon: item?.icon,
			description: item?.description,
			title: item?.link?.title,
			url: item?.link?.url,
			id: item?.link?.attributes?.id,
			className: item?.link?.attributes?.class,
			target: item?.link?.attributes?.target,
			rel: item?.link?.attributes?.rel,
		})),
	}
	return <ToolBox {...props} />
}

export default ToolBoxContainer
