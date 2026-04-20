import { useEffect, useRef } from "react"
import { Link, Icon, Animate } from "@/ui"
import { dlPush } from "@vactorynext/core/lib"
import { vclsx } from "@vactorynext/core/utils"
import { useRouter } from "next/router"

export const config = {
	id: "vactory_default:21",
}

export const ToolBox = ({ items, className = "" }) => {
	// push data layer when hovering on a toolbox item
	const hanldeMouseEnter = (item) => {
		dlPush("Affichage toolkit", {
			Type: item?.title,
		})
	}

	const { locale } = useRouter()

	const ulRef = useRef()

	// remove css classes injected by Animate component to allow animation on hovering
	useEffect(() => {
		setTimeout(() => {
			ulRef.current &&
				Array.from(ulRef.current.children).forEach((el) => {
					return [...el.classList]
						.filter((className) => className.startsWith("css-"))
						.forEach((classToRemove) => {
							el.classList.remove(classToRemove)
						})
				})
		}, 2000)
	}, [ulRef])

	return (
		<div
			className={vclsx(
				"max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:z-30 max-lg:bg-white max-lg:shadow-lg",
				"lg:fixed lg:left-[calc(100%-45px)] lg:top-[200px] lg:z-10",
				className
			)}
		>
			<ul
				className="lg:flex lg:flex-col lg:items-start max-lg:flex max-lg:flex-row max-lg:items-stretch max-lg:justify-between max-lg:bg-gradient"
				ref={ulRef}
			>
				<Animate
					animationType="fade"
					direction={locale === "ar" ? "left" : "right"}
					cascade={true}
					damping={0.2}
					delay={500}
				>
					{items.map((item) => {
						return (
							<li
								onMouseEnter={() => {
									hanldeMouseEnter(item)
								}}
								key={item.id}
								className={vclsx(
									"max-lg:flex-1 max-lg:rounded-none max-lg:border-r max-lg:border-gray-200 max-lg:last:border-r-0",
									"lg:mb-2 lg:translate-x-0 lg:whitespace-nowrap lg:rounded-bl-full lg:rounded-tl-full lg:shadow lg:hover:translate-x-[calc(-100%+50px)] rtl:lg:hover:translate-x-[calc(100%-50px)]",
									"animate text-white lg:bg-gradient",
									item.hiddenMobile && "max-lg:hidden"
								)}
							>
								<Link
									id={item.id}
									href={item.url}
									target={item.target}
									rel={item.rel}
									className={vclsx(
										"flex items-center font-medium",
										"text-xs lg:flex-row lg:text-sm max-lg:flex-col max-lg:justify-center max-lg:gap-1 max-lg:py-2",
										item.className
									)}
								>
									<span
										className={vclsx(
											"inline-flex items-center justify-center",
											"max-lg:h-6 max-lg:w-6",
											"lg:h-12 lg:w-12"
										)}
									>
										<Icon
											id={item.icon}
											className="lg:h-4 lg:w-4 max-lg:h-5 max-lg:w-5"
										/>
									</span>
									<span
										className={vclsx(
											"inline-block",
											"max-lg:text-center max-lg:text-[10px] max-lg:leading-tight",
											"lg:py-3 lg:pr-3"
										)}
									>
										{item.title}
									</span>
								</Link>
							</li>
						)
					})}
				</Animate>
			</ul>
		</div>
	)
}

const ToolBoxContainer = ({ data }) => {
	const props = {
		items: data?.components?.map((item) => ({
			hiddenMobile: item?.hide,
			active: item?.active,
			icon: item?.icon,
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
