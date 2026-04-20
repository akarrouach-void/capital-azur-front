import React, { useState, Fragment } from "react"

import { Transition } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { Icon } from "../icon/Icon"
import { alert } from "./theme"

export const Alert = ({
	children,
	wrapper = "contained",
	variant = "info",
	icon = "check",
	className,
	shouldClose = true,
}) => {
	const [show, setShow] = useState(true)
	const handleCloseClick = () => {
		shouldClose && setShow(false)
	}
	return (
		<Transition show={show} as={Fragment} {...alert.animation}>
			<div className={vclsx(alert.wrapper[wrapper], alert.variant[variant], className)}>
				<div className="flex w-full items-center justify-between gap-2">
					<div className="flex w-full items-center gap-2">
						<Icon id={icon} className={vclsx(alert["icon"])} />
						{children}
					</div>

					{shouldClose && (
						<button onClick={handleCloseClick} className="cursor-pointer">
							<Icon id="x" className={vclsx(alert["icon"])} />
						</button>
					)}
				</div>
			</div>
		</Transition>
	)
}

export default Alert
