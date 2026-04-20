import { Image, Text, Link, SplashScreen } from "@/ui"
import Cookies from "js-cookie"

export const config = {
	id: "vactory_satisfaction:splash-screen",
}

const SatisfactionWidget = ({ data }) => {
	const layerConfig = data?.extra_field?.group_params
	const { button, logo, title, subtitle } = data?.components[0]
	const submitted = Cookies.get("satisfactionSubmitted") == "true"

	return (
		<>
			{!submitted ? (
				<SplashScreen {...layerConfig}>
					<div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-6 text-center shadow-md">
						<Image
							src={logo?.[0]?._default}
							alt={logo?.[0]?.meta?.alt}
							{...logo?.[0]?.meta}
						/>
						<Text className="text-2xl font-semibold text-gray-800">{title}</Text>
						<Text className="text-sm text-gray-500">{subtitle}</Text>
						<Link
							variant="permalink"
							href={button.url}
							className="text-blue-500 hover:underline"
						>
							{button.title}
						</Link>
					</div>
				</SplashScreen>
			) : null}
		</>
	)
}

export default SatisfactionWidget
