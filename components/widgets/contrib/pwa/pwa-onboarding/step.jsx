import { Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const Step = ({
	title,
	description,
	image,
	//link_title,
	className = "",
	children,
	//step,
	//active,
	//moveToNext,
}) => {
	return (
		<div
			className={vclsx(
				"absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-hidden",
				className
			)}
		>
			<div className="flex h-full flex-col overflow-y-auto px-10 pb-10 pt-[10vh]">
				<Image
					{...image}
					alt="Onboarding Image"
					className="mx-auto mb-7 max-h-[40vh] w-full max-w-[261px]"
				/>
				<h2 className="mb-5 text-xl font-bold leading-[30px]">{title}</h2>
				<p className="text-sm font-normal leading-5 text-black">{description}</p>
				<div className="mt-auto">{children}</div>
			</div>
		</div>
	)
}
