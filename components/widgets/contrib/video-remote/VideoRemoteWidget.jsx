import { useEffect, useRef, useState } from "react"
import YouTube from "react-youtube"
import { Icon, Wysiwyg } from "@/ui"
import { vclsx, YouTubeGetID } from "@vactorynext/core/utils"
import { useI18n } from "@vactorynext/core/hooks"

export const config = {
	id: "custom_dynamic_fields:sample",
}

const VideoRemoteWidget = ({ data }) => {
	const { t } = useI18n()
	const videoElement = useRef()
	const [isVideoVisible, setVideoVisible] = useState(false)
	const [minimized, setMinimized] = useState(false)
	const [isTranscriptionVisible, setTranscriptionVisible] = useState(false)

	const props = {
		title: data?.components[0]?.title,
		description: data?.components[0]?.description.value["#text"],
		video_id: data?.components[0]?.video_transcription?.url,
		video: data?.components[0]?.video_transcription,
		video_name: data?.components[0]?.video_transcription?.name,
		transcription: data?.components[0]?.video_transcription?.transcription || "",
	}
	const source = props?.video_id ? YouTubeGetID(props?.video_id) : null

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
			<div
				ref={videoElement}
				className="aspect-h-9 aspect-w-16 relative border border-gray-200"
			>
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
								id={source}
								videoId={source}
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
					</div>
				)}
			</div>
			<div className="mt-4">
				<button
					onClick={() => setTranscriptionVisible(!isTranscriptionVisible)}
					className="text-primary-500 underline hover:text-primary-700"
				>
					{isTranscriptionVisible
						? t("Nx:Fermer la transcription")
						: t("Nx:Ouvrir la transcription")}
				</button>
				{isTranscriptionVisible && (
					<div className="mt-2 rounded-md bg-gray-100 p-4 text-gray-800">
						<h3 className="text-lg font-bold"> {t("Nx:Transcription textuelle")}</h3>
						{props.transcription && <Wysiwyg html={props.transcription} />}
					</div>
				)}
			</div>
		</div>
	)
}

export default VideoRemoteWidget
