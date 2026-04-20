import dynamic from "next/dynamic"
import { useState } from "react"
//import YouTube from "react-youtube"
//import YoutubeBackground from 'react-youtube-background'

import { Button, Icon } from "@/ui"

const YoutubeBackground = dynamic(() => import("react-youtube-background"), {
	ssr: false,
})

export const BgVideo = ({ bgVideo, children, className = "" }) => {
	const [muted, setMuted] = useState(1)
	/* 	const opts = {
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 1,
			mute: muted, // This option will start the video muted
			controls: 0,
			showCaptions: 0,
			disableKeyboard: 1,
			allowFullscreen: 0,
		},
		width: "100%",
		height: "100%",
	} */

	return (
		<YoutubeBackground
			videoId={bgVideo.split("?v=")[1]}
			//autoplay={true}
			//muted={muted}
			className={`iframe-wrapper  relative h-[100vh] min-h-[500px] w-[100vw] overflow-hidden ${className}`}
		>
			{/* 			<YouTube
				className="absolute inset-0 w-full h-full -z-[1]"
				//id={props.video}
				videoId={bgVideo.split("?v=")[1]}
				opts={opts}
				width="100%"
			></YouTube> */}
			<Button
				className="absolute bottom-10 right-10 z-10"
				onClick={() => {
					setMuted((old) => (old === 1 ? 0 : 1))
				}}
			>
				<Icon
					id={muted === 1 ? "volume-off" : "volume-up"}
					width="24"
					height="24"
					className="text-white"
				/>
			</Button>
			<div>{children}</div>
		</YoutubeBackground>
	)
}
