import get from "lodash.get"
import React, { useState, useRef } from "react"

import { Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:49",
}

const ToolBoxContainer = ({ data }) => {
	const [isActive, setIsActive] = useState(false)
	const toolboxRef = useRef(null)

	function clickOutsideToolbox(ref) {
		function handleClickOutsideToolbox(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsActive(false)
			}
		}
		if (typeof window !== "undefined") {
			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutsideToolbox)
		}
		return () => {
			if (typeof window !== "undefined") {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutsideToolbox)
			}
		}
	}

	const handlClick = (e) => {
		e.preventDefault()
		setIsActive(!isActive)
		clickOutsideToolbox(toolboxRef)
	}

	const props = {
		items: data?.components?.map((item) => ({
			icon: get(item, "icon", null),
			link: {
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
			<div ref={toolboxRef} className={vclsx("fixed bottom-[120px] right-4 z-50")}>
				<ul
					className={vclsx(
						"invisible m-0 flex h-0 list-none flex-col items-center justify-center p-0 opacity-0 transition-all duration-300",
						isActive && "!visible !h-full !opacity-100"
					)}
				>
					{props.items.map((item, index) => {
						return (
							<li key={index}>
								<Link
									{...item.link}
									href={item.link.href}
									className={vclsx(
										item.link.className,
										"m-2 flex h-12 w-12 translate-x-0 translate-y-[40px] scale-[0.4] cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-white transition duration-300",
										isActive && "!translate-x-0 !translate-y-0 !scale-100"
									)}
									id={item.link.id}
								>
									<span
										className={
											"absolute right-14 whitespace-nowrap rounded-2xl bg-black/60 px-4 py-1 text-[12px]"
										}
									>
										{item.link.title}
									</span>
									<Icon id={item.icon} className="h-4 w-4 fill-current" />
								</Link>
							</li>
						)
					})}
				</ul>
				<button
					onClick={(e) => handlClick(e)}
					className={vclsx(
						"relative z-50 my-3 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-white shadow outline-none"
					)}
				>
					<Icon id={"clic"} className="h-5 w-5 fill-current" />
				</button>
			</div>
		</>
	)
}

export default ToolBoxContainer
