import { Fragment, useState, useEffect, useRef } from "react"

import { Transition } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { Icon } from "../icon/Icon"
import { notification } from "./theme"

export const Notification = ({
	className = "",
	variant = "default",
	icon = "check-circle",
	disappearAfter,
	// children,
	...props
}) => {
	const timeourRef = useRef()
	const [show, setShow] = useState(true)

	const handleMouseEnter = () => {
		clearTimeout(timeourRef.current)
	}

	const handleMouseLeave = () => {
		setShow(false)
	}

	useEffect(() => {
		if (disappearAfter) {
			timeourRef.current = setTimeout(() => {
				setShow(false)
			}, disappearAfter)
		}
	}, [disappearAfter])
	return (
		<div
			aria-live="assertive"
			className={vclsx(notification[variant].wrapper, className)}
			{...props}
		>
			<Transition
				show={show}
				as={Fragment}
				enter="transform ease-out duration-300 transition"
				enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2 sm:rtl:-translate-x-2"
				enterTo="translate-y-0 opacity-100 sm:translate-x-0"
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					role="alert"
					className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
				>
					<div className="p-4">
						<div className="flex items-start">
							<div className="flex-shrink-0">
								<Icon id={icon} className="h-6 w-6 text-success-400" aria-hidden="true" />
							</div>
							<div className="ml-3 w-0 flex-1 pt-0.5">
								<p className="text-sm font-medium text-gray-900">Successfully saved!</p>
								<p className="mt-1 text-sm text-gray-500">
									Anyone with a link can now view this file.
								</p>
							</div>
							<div className="ml-4 flex flex-shrink-0">
								<button
									className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
									onClick={() => {
										setShow(false)
									}}
								>
									<span className="sr-only">Close</span>
									<Icon id="x" className="h-5 w-5" aria-hidden="true" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	)
}
