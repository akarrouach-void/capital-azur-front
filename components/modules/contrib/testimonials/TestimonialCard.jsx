import { Link, Heading, Text, Badge, Image, Flag } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { useState } from "react"
import ImageNotFound from "public/assets/img/image-not-found.png"

export const TestimonialCard = ({
	id,
	title,
	excerpt,
	image,
	url,
	className,
	date,
	profile,
	isFlagged,
	hasFlag,
	reloadPage = null,
}) => {
	const { t } = useI18n()
	const [flageChange, setflageChange] = useState("")
	return (
		<article className={vclsx("relative h-full pt-[100px]", className)}>
			<div className="absolute left-[50%] top-0 z-[1] translate-x-[-50%] rtl:translate-x-[50%]">
				<div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border-2 border-white shadow-xl">
					<Image
						src={image?.uri?.value?._default || ImageNotFound?.src}
						alt={image?.meta?.alt || "Image not found"}
						title={title}
						fill
						sizes="150px"
						className="object-cover"
					/>
				</div>
			</div>
			<div className="flex h-full flex-col items-start rounded-lg bg-white shadow-lg">
				<Link
					href={url}
					className="group relative flex h-full w-full flex-col items-start px-5 pb-8 pt-[70px]"
					aria-label={`${t("Nx:En savoir plus")}: ${title}`}
				>
					{(profile || date) && (
						<div className="mb-[18px] flex flex-row items-center">
							{profile && <Badge text={profile} variant="default" />}
							{date && (
								<Text
									variant="small"
									className={vclsx(
										"pr-[10px] text-gray-300",
										profile ? "  ml-[10px] border-l border-l-gray-300 pl-[10px]" : null
									)}
								>
									{date}
								</Text>
							)}
							{hasFlag && (
								<Flag
									id={id}
									title={title}
									module="default_flag"
									className="absolute right-4 top-4 cursor-pointer"
									isFlagged={isFlagged}
									reloadPage={reloadPage}
									flageChange={flageChange}
									onFlaggedChange={() => setflageChange(Date.now())}
								/>
							)}
						</div>
					)}

					<>
						{title && (
							<Heading level="3" variant="cardTitle" className="mb-[18px]">
								{title}
							</Heading>
						)}
						{excerpt && (
							<Text variant="cardExcerpt" className="mb-[25px]">
								{excerpt}
							</Text>
						)}
					</>
					{url && (
						<Text variant="permalink" className="mt-auto w-fit">
							{t("Nx:En savoir plus")}
						</Text>
					)}
				</Link>
			</div>
		</article>
	)
}
