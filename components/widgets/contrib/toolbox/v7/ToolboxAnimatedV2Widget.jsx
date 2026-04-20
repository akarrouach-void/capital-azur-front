import get from "lodash.get"
import { useState, useRef } from "react"

import { Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:93",
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
		button: {
			title: get(data, "extra_field.title", ""),
			icon: get(data, "extra_field.icon", ""),
		},
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

	const itemsCount = props.items.length + 1
	const pi = 3.14
	const openDistance = "105"
	const openingAngle = pi * 2

	return (
		<>
			<nav
				ref={toolboxRef}
				className={vclsx(
					"fixed bottom-0 left-1/2 z-50 block -translate-x-1/2 text-center transition-all duration-300 ease-in-out rtl:translate-x-1/2",
					isActive ? "bottom-32" : "bottom-0"
				)}
				// style={{
				// 	filter: "url(#shadowed-goo)",
				// }}
			>
				<button
					onClick={(e) => handlClick(e)}
					className={vclsx(
						"absolute bottom-4 left-1/2 z-[2] inline-flex h-[54px] w-[54px] -translate-x-1/2 translate-y-0 scale-[1.1] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-center text-white transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.320,1.275)] hover:scale-[1.2] sm:h-[64px] sm:w-[64px] rtl:translate-x-1/2",
						isActive && "scale-[0.9] duration-[200ms] ease-linear"
					)}
				>
					<Icon
						id={isActive ? "x" : props?.button?.icon}
						className="h-4 w-4 fill-current sm:h-5 sm:w-5"
					/>
					{props.button.title && <span className={"sr-only"}>{props.button.title}</span>}
				</button>
				{props.items.map((item, index) => {
					const elementIndex = index + 1
					const angle =
						(pi - openingAngle) / 2 +
						(openingAngle / (itemsCount - 1)) * (elementIndex - 1)

					return (
						<Link
							{...item.link}
							key={index}
							href={item.link.href}
							className={vclsx(
								item.link.className,
								"absolute bottom-5 ml-[-25px] inline-flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-full bg-primary text-center text-white sm:ml-[-30px] sm:h-[60px] sm:w-[60px]"
							)}
							style={{
								transitionDuration: isActive ? `${80 + 100 * elementIndex}ms` : `180ms`,
								transform: isActive
									? `translate3d(${Math.cos(angle) * openDistance}px,${
											Math.sin(angle) * openDistance
										}px,0)`
									: "translate3d(0,0,0)",
								transitionTimingFunction: isActive
									? "cubic-bezier(0.935, 0.000, 0.340, 1.330)"
									: "cubic-bezier(0.165, 0.840, 0.440, 1)",
							}}
							id={item.link.id}
						>
							<Icon id={item.icon} className="h-4 w-4 fill-current" />
							<span className={"sr-only"}>{item.link.title}</span>
						</Link>
					)
				})}
			</nav>

			<svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden">
				<defs>
					<filter id="shadowed-goo">
						<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
						<feColorMatrix
							in="blur"
							mode="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
							result="goo"
						/>
						<feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
						<feColorMatrix
							in="shadow"
							mode="matrix"
							values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
							result="shadow"
						/>
						<feOffset in="shadow" dx="1" dy="1" result="shadow" />
						<feComposite in2="shadow" in="goo" result="goo" />
						<feComposite in2="goo" in="SourceGraphic" result="mix" />
					</filter>
					<filter id="goo">
						<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
						<feColorMatrix
							in="blur"
							mode="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
							result="goo"
						/>
						<feComposite in2="goo" in="SourceGraphic" result="mix" />
					</filter>
				</defs>
			</svg>
		</>
	)
}

export default ToolBoxContainer
