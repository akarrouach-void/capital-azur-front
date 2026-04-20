import { Wysiwyg, SplashScreen } from "@/ui"

export const config = {
	id: "vactory_splashscreen:splash-screen",
}

const SplashScreenWidget = ({ data }) => {
	const { date_end, date_start, display_number, duration } =
		data?.extra_field?.group_params

	const { description } = data?.components?.[0]

	const props = {
		date_end,
		date_start,
		display_number,
		duration,
	}

	return (
		<div>
			<SplashScreen {...props}>
				<div className="w-full max-w-full bg-white p-7 md:min-w-[700px]">
					<Wysiwyg className="mb-4" html={description?.value["#text"]} />
				</div>
			</SplashScreen>
		</div>
	)
}

export default SplashScreenWidget
