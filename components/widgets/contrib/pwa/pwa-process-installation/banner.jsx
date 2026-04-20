import { Image, Button, Icon } from "@/ui"

export const Banner = ({ logo, btn_title, showSplashScreen, handleHideBanner }) => {
	return (
		<div className="fixed left-0 top-0 z-[10000] flex w-full items-center justify-between gap-7 bg-primary-500 px-5 py-[17px] shadow">
			<div className="flex items-center gap-4">
				<button onClick={handleHideBanner}>
					<Icon id="x" className="h-4 w-4 text-white" width="16" height="16" />
				</button>
				<Image {...logo} alt="Logo" className="w-[90px]" />
			</div>
			<Button variant="white" size="small" onClick={showSplashScreen}>
				{btn_title}
				<Icon id="download" width="16" height="16" />
			</Button>
		</div>
	)
}
