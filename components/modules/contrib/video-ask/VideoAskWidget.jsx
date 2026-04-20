// import { useFlag } from "@vactory/console/client"
import { VideoAsk } from "./video-ask"

export const config = {
	id: "vactory_video_ask:video-ask",
	/* adminFlagsConfig: {
		group: "Video Ask",
		flags: [
			{
				name: "enable",
				defaultValue: true,
				fieldLabel: "Enable video ask",
				fieldType: "boolean",
			},
		],
	}, */
}

const VideoAskContainer = ({ data }) => {
	/* const isFlagEnabled = useFlag("enable", config.id)
	if (!isFlagEnabled) {
		return <></>
	} */

	const props = {
		// not started yet
		not_started: {
			title: data?.components?.[0]?.group_not_started?.title,
			icon: data?.components?.[0]?.group_not_started?.icon,
			Button_label: data?.components?.[0]?.group_not_started?.Button_label,
			image: {
				src: data?.components?.[0]?.group_not_started?.image?.[0]?._default,
				width: data?.components?.[0]?.group_not_started?.image?.[0]?.meta?.width,
				height: data?.components?.[0]?.group_not_started?.image?.[0]?.meta?.height,
				alt: data?.components?.[0]?.group_not_started?.image?.[0]?.meta?.alt,
			},
			content: data?.components?.[0]?.group_not_started?.content?.value?.["#text"],
		},
		// has been started
		started: {
			title: data?.components?.[0]?.group_started?.title,
			icon: data?.components?.[0]?.group_started?.icon,
			Button_label: data?.components?.[0]?.group_started?.Button_label,
			image: {
				src: data?.components?.[0]?.group_started?.image?.[0]?._default,
				width: data?.components?.[0]?.group_started?.image?.[0]?.meta?.width,
				height: data?.components?.[0]?.group_started?.image?.[0]?.meta?.height,
				alt: data?.components?.[0]?.group_started?.image?.[0]?.meta?.alt,
			},
			content: data?.components?.[0]?.group_started?.content?.value?.["#text"],
		},
		// screens@
		items: data?.components?.[0]?.body?.screen_details?.map((item) => ({
			id: item?.id,
			// layout
			bgType: item?.layout?.background,
			bgImage: item?.layout?.image?.url,
			bgVideo: item?.layout?.video?.url,
			content: item?.layout?.text?.value,
			// quiz
			quiz: item?.quiz?.part_of_quiz,
			// response
			type_response: item?.response?.type_response,
			response: item?.response?.settings,

			// extra button

			extra_button: item?.response?.extra_button?.extra_button,
		})),
		// extra fields
		title: data?.extra_field?.big_title || null,
		icon: data?.extra_field?.icon || null,
		show_btn: data?.extra_field?.show_btn || false,
		show_content: data?.extra_field?.show_content || false,
		content_first_screen:
			data?.extra_field?.content_first_screen?.value?.["#text"] || null,
	}
	return <VideoAsk {...props} />
}

export default VideoAskContainer
