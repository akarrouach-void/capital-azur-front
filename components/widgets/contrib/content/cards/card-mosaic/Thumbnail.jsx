import { Icon, Image } from "@/ui"

export const Thumbnail = ({ onClick, image, imageAlt }) => {
	return (
		<div
			onClick={onClick}
			onKeyDown={(e) => {
				e.key === "Enter" && onClick()
			}}
			role="button"
			tabIndex={0}
			className="h-full w-full"
		>
			<Image
				{...image}
				alt={imageAlt}
				className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
			/>

			<div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center">
				<Icon id="play" className="h-16 w-16 text-white hover:text-gray-100"></Icon>
			</div>
			<div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-black/30"></div>
		</div>
	)
}
