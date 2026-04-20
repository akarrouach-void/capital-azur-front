import { Image, SplashScreen } from "@/ui"
import get from "lodash.get"

export const config = {
	id: "vactory_default:splash-screen-image",
}

const SplashScreenImageWidget = ({ data }) => {
	const { display_number, duration } = data?.extra_field?.group_params

	const config = {
		display_number,
		duration,
	}

	const imageContent = {
		src: get(data, "components[0].image[0]._default", null),
		width: get(data, "components[0].image[0].meta.width", null),
		height: get(data, "components[0].image[0].meta.height", null),
		alt: get(data, "components[0].image[0].meta.alt", null),
	}

	return (
		<SplashScreen {...config}>
			<Image
				src={imageContent.src}
				alt={imageContent.alt}
				width={imageContent.width}
				height={imageContent.height}
				className="rounded-xl"
			/>
		</SplashScreen>
	)
}

export default SplashScreenImageWidget
