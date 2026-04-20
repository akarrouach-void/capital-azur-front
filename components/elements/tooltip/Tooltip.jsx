import React, { Fragment, useState } from "react"

import { Transition } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { tooltip } from "./theme"

export const Tooltip = ({ className, size = "xsmall", position, text, children }) => {
	const [showTooltip, setShowTooltip] = useState(false)
	const handleMouseEnter = () => {
		setShowTooltip(true)
	}

	const handleMouseLeave = () => {
		setShowTooltip(false)
	}
	return (
		<div
			className="relative"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			role="tooltip"
		>
			{children}
			<Transition
				as={Fragment}
				show={showTooltip}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<div className={vclsx(className, tooltip.wrapper, tooltip["position"][position])}>
					<p className={vclsx(tooltip.size[size])}>{text}</p>
				</div>
			</Transition>
		</div>
	)
}
