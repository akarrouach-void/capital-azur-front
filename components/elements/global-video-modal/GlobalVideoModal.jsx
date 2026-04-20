import React, { useState, useEffect, useRef } from "react"
import YouTube from "react-youtube"

import { useVideo } from "@vactorynext/core/hooks"
import { Transition, TransitionChild } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

const LoadingSpinner = () => (
	<div className="absolute inset-0 flex items-center justify-center text-white">
		Loading …
	</div>
)

export const GlobalVideoModal = ({ minimizerIcon, expenderIcon, closeIcon }) => {
	const { source, isOpen, setIsOpen, minimize, setMinimize } = useVideo()

	const [isLoading, setIsLoading] = useState(true)
	const ref = useRef(null)

	const onReady = () => {
		setIsLoading(false)
	}

	useEffect(() => {
		setIsLoading(true)
	}, [isOpen])

	// close on click outside
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				setIsOpen(false)
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.addEventListener("keydown", handleKeyDown)
		}
	}, [isOpen])

	const opts = {
		playerVars: {
			autoplay: 1,
			rel: 0,
		},
	}

	return (
		<Transition
			as="div"
			show={isOpen}
			enter="transition-opacity duration-75"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-150"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			className={vclsx(
				"fixed z-[1000] flex items-center justify-center transition",
				minimize
					? "bottom-5 ltr:left-0 sm:ltr:left-5 rtl:right-0 sm:rtl:right-5"
					: "inset-0 p-5 lg:px-40 xxl:px-64"
			)}
		>
			<TransitionChild
				show={!minimize && isOpen}
				enter="transition-opacity ease-linear duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity ease-linear duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
			>
				<button
					type="button"
					onClick={() => {
						setIsOpen(false)
					}}
					className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
					aria-label="Close modal"
				/>
			</TransitionChild>
			<TransitionChild
				show={isOpen}
				enter="transition-opacity ease-linear duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity ease-linear duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				className={vclsx(
					"relative flex-1 bg-black shadow-xl transition",
					minimize ? "rounded-md" : "rounded-lg"
				)}
			>
				<div ref={ref} className="group">
					<div
						className={vclsx(
							"absolute z-50 mb-1 md:bottom-full ltr:right-0 rtl:left-0",
							"space-x-1 md:group-hover:opacity-100 lg:opacity-0"
						)}
					>
						<button
							onClick={() => setMinimize(!minimize)}
							type="button"
							className="hidden rounded-md bg-black bg-opacity-50 p-2 text-white hover:text-warning-500 md:inline"
						>
							<span className="sr-only">Minimize</span>
							{minimize ? expenderIcon : minimizerIcon}
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								setIsOpen(false)
							}}
							type="button"
							className="rounded-md bg-black bg-opacity-50 p-2 text-white hover:text-warning-500"
						>
							<span className="sr-only">Close</span>
							{closeIcon}
						</button>
					</div>
					<div
						className={vclsx(
							"overflow-hidden",
							minimize
								? "h-56 w-96 rounded-md"
								: "aspect-h-9 aspect-w-16 isolate rounded-lg "
						)}
					>
						<YouTube
							id={source}
							onReady={() => {
								onReady()
							}}
							opts={opts}
							videoId={source}
							iframeClassName="w-full h-full"
							className="absolute bottom-0 left-0 top-0 my-auto h-full w-full"
						/>
						{/* <ReactPlayer
										url={source}
										playing
										width="100%"
										height="100%"
										controls
										onReady={onReady}
										muted
									/> */}
					</div>
					{isLoading && (
						<LoadingSpinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rtl:translate-x-1/2" />
					)}
				</div>
			</TransitionChild>
		</Transition>
	)
}
