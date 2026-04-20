import get from "lodash.get"
import { useState, useRef } from "react"

import { Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:94",
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

	// const itemsCount = props.items.length
	// const pi = 3.14
	// const openDistance = 105
	// const openingAngle = pi * 2

	return (
		<>
			<nav
				ref={toolboxRef}
				className={vclsx(
					"fixed bottom-4 left-1/2 z-50 block -translate-x-1/2 text-center transition-all duration-300 ease-in-out rtl:translate-x-1/2"
				)}
				style={{
					filter: "url(#shadowed-goo)",
				}}
			>
				<button
					onClick={(e) => handlClick(e)}
					className={vclsx(
						"absolute bottom-0 left-1/2 z-[2] inline-flex h-[48px] w-[48px] -translate-x-1/2 translate-y-0 scale-[1.1] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-center text-white transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.320,1.275)] hover:scale-[1.2] sm:h-[54px] sm:w-[54px]",
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
					const totalItems = props.items.length
					const halfIndex = Math.ceil(totalItems / 2)

					// Calculate if item should go left or right
					const isLeftSide = elementIndex <= halfIndex
					const positionIndex = isLeftSide
						? halfIndex - elementIndex + 1.75
						: elementIndex - halfIndex - 0.2

					const spacing = {
						mobile: 50,
						tablet: 65,
						desktop: 75,
					}

					const getTransform = (size) => {
						const direction = isLeftSide ? "-" : ""
						const distance = size * positionIndex
						return `translate3d(${direction}${distance}px, 0, 0)`
					}

					return (
						<Link
							{...item.link}
							key={index}
							href={item.link.href}
							className={vclsx(
								item.link.className,
								"absolute bottom-0 left-1/2 inline-flex h-[48px] w-[48px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-primary text-center text-white opacity-100 transition-opacity sm:h-[54px] sm:w-[54px]",
								!isActive && "opacity-0"
							)}
							style={{
								transitionDuration: isActive ? `${90 + 80 * positionIndex}ms` : `180ms`,
								transform: isActive
									? getTransform(spacing.mobile)
									: "translate3d(0, 0, 0)",
								"@media (min-width: 640px)": {
									transform: isActive
										? getTransform(spacing.tablet)
										: "translate3d(0, 0, 0)",
								},
								"@media (min-width: 1024px)": {
									transform: isActive
										? getTransform(spacing.desktop)
										: "translate3d(0, 0, 0)",
								},
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
						<feBlend in2="shadow" in="goo" result="goo" />
						<feBlend in2="goo" in="SourceGraphic" result="mix" />
					</filter>
					<filter id="goo">
						<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
						<feColorMatrix
							in="blur"
							mode="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
							result="goo"
						/>
						<feBlend in2="goo" in="SourceGraphic" result="mix" />
					</filter>
				</defs>
			</svg>
		</>
	)
}

export default ToolBoxContainer
