import { Image, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const SplashScreen = ({
	title,
	description,
	logo,
	hideSplashScreen,
	positionArrow = "up-right",
}) => {
	const position = {
		"down-center": "absolute bottom-8 left-1/2 -translate-x-1/2 bounce-down",
		"down-right": "absolute right-4 bottom-4 bounce-down",
		"up-right": "absolute right-4 top-4 bounce-up",
	}

	return (
		<div className="fixed left-0 top-0 z-[999999] flex h-full w-full items-center justify-center bg-primary-500">
			<button onClick={hideSplashScreen} className="absolute left-11 top-11 text-white">
				<Icon
					id="x"
					width="30"
					height="30"
					className="h-[30px] min-h-[30px] w-[30px] min-w-[30px]"
				/>
			</button>
			<div className="max-w-[317px] p-5 text-center text-white">
				<Image {...logo} alt="Logo" className="mb-[43px] w-[233px] max-w-full" />
				<h2 className="mb-[43px] text-[23px] font-bold leading-none">{title}</h2>
				<p className="text-base font-semibold leading-[23px] text-white">{description}</p>
				<Icon
					id="arrow-up"
					width="24"
					height="24"
					className={vclsx("text-white", position[positionArrow])}
				/>
			</div>
		</div>
	)
}
