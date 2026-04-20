import { useEffect, useRef, useState } from "react"
import YouTube from "react-youtube"

import { Icon, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:26",
}

// 0:
// description:
// value: {#type: 'processed_text', #text: '<p>On sait depuis longtemps que travailler avec du…comparable avec celle du français standard.</p>\r\n', #format: 'full_html'}
// [[Prototype]]: Object
// image: Array(1)
// 0: {_default: 'http://localhost:8080/sites/default/files/2022-08/pexels-breno-santos-10060128.jpg', _lqip: 'http://localhost:8080/sites/default/files/styles/l…08/pexels-breno-santos-10060128.jpg?itok=L1ujLE1U', uri: '2022-08/pexels-breno-santos-10060128.jpg', fid: '54', file_name: 'pexels-breno-santos-10060128.jpg', …}
// length: 1
// [[Prototype]]: Array(0)
// image_alt: "Flowers image"
// video: "A6O2aIYxByE"
// _weight: 1

const VideoSticky = ({ data }) => {
	const videoElement = useRef()
	const [isVideoVisible, setVideoVisible] = useState(false)
	const [minimized, setMinimized] = useState(false)
	const props = {
		video: data?.components[0]?.video,
		image: data?.components[0]?.image[0]?._default,
		image_alt: data?.components[0]?.image[0]?.meta.alt,
	}

	const opts = {
		playerVars: {
			autoplay: 1,
			rel: 0,
		},
	}

	const checkIfVideoOnViewport = () => {
		const elementBoundingClientRect = videoElement.current.getBoundingClientRect()
		if (elementBoundingClientRect.y + elementBoundingClientRect.height < 0) {
			setMinimized(true)
		} else {
			setMinimized(false)
		}
	}

	const scrollUpToVideo = () => {
		videoElement.current.scrollIntoView({ behavior: "smooth", block: "center" })
	}

	useEffect(() => {
		if (isVideoVisible) {
			window.addEventListener("scroll", checkIfVideoOnViewport)
			return () => {
				window.removeEventListener("scroll", checkIfVideoOnViewport)
			}
		}
	}, [isVideoVisible])

	return (
		<div>
			<div className="mb-12 h-[900px] w-full bg-gray-100"></div>
			<div ref={videoElement} className="aspect-h-9 aspect-w-16 relative">
				{isVideoVisible ? (
					<div className="h-full w-full">
						<div
							className={vclsx(
								minimized
									? "fixed bottom-3 right-3 h-48 w-80 rounded-md"
									: "h-full w-full rounded-lg"
							)}
						>
							{minimized && (
								<div className="absolute bottom-full right-0 mb-2 flex items-center gap-x-1 ">
									<button
										onClick={scrollUpToVideo}
										className="rounded-md bg-black bg-opacity-50 p-1 text-white hover:text-warning-500"
									>
										<Icon id="chevron-up" className="h-4 w-4" />
									</button>
									<button
										onClick={() => {
											setVideoVisible(false)
											setMinimized(false)
										}}
										className="rounded-md bg-black bg-opacity-50 p-1 text-white hover:text-warning-500"
									>
										<Icon id="x" className="h-4 w-4" />
									</button>
								</div>
							)}
							<YouTube
								id={props.video}
								videoId={props.video}
								opts={opts}
								iframeClassName="w-full h-full rounded-md"
								className="absolute bottom-0 left-0 top-0 my-auto h-full w-full "
							/>
						</div>
					</div>
				) : (
					<div
						onClick={() => {
							setVideoVisible(true)
						}}
						onKeyDown={(e) => {
							e.key === "Enter" && setVideoVisible(true)
						}}
						role="button"
						tabIndex={0}
						className="group h-full w-full"
					>
						<div className="absolute bottom-0 left-0 right-0 top-0 z-40 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-black ring-2 ring-gray-50 ring-offset-2 transition group-hover:h-16 group-hover:w-16 ">
							<Icon id="play" className="h-12 w-12 text-white" />
						</div>
						<div className="absolute right-0 top-0 z-20 h-full w-full bg-black/30"></div>
						<Image
							src={props.image}
							alt={props.image_alt}
							className="h-full w-full object-cover"
						/>
					</div>
				)}
			</div>
			<div className="mt-12 h-[1200px] w-full bg-gray-100"></div>
		</div>
	)
}

export default VideoSticky
