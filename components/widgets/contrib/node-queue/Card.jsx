import { Link, Icon, Image } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

const CardImage = ({ image, alt = "", ...rest }) => {
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			{image?._default && image?.meta?.width && image?.meta?.height ? (
				<Image
					src={image?._default}
					alt={alt}
					className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
					width={Number((image?.meta?.width / 3).toFixed(2))}
					height={Number((image?.meta?.height / 3).toFixed(2))}
					quality={40}
					{...rest}
				/>
			) : null}
		</div>
	)
}

export const Card = ({
	image,
	category,
	date,
	className,
	url,
	title,
	excerpt,
	...rest
}) => {
	const { t } = useI18n()
	return (
		<div
			className={vclsx(
				"lrt:text-left flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white text-black rtl:text-right",
				className
			)}
			{...rest}
		>
			<div className="w-full flex-shrink-0">
				{<CardImage image={image} alt={title} />}
			</div>
			<div className="flex h-full flex-col p-6">
				{(category || date) && (
					<div className="mb-[18px] flex flex-row items-center">
						<p className="tags text-base font-semibold text-primary-600 hover:text-primary-500">
							{category}
						</p>
						{date && (
							<p className="ml-[10px] border-l border-l-gray-500 px-[10px] text-xs leading-[18px] text-gray-500">
								{date}
							</p>
						)}
					</div>
				)}
				<Link
					href={url}
					className="block"
					aria-label={`${t("Nx:En savoir plus")}: ${title}`}
				>
					<>
						{title && (
							<h3 className="mb-[18px] text-xl font-semibold leading-[30px] tracking-[1px] text-primary-900 hover:text-primary-500">
								{title}
							</h3>
						)}
						{excerpt && (
							<p className="mb-[25px] text-sm leading-[21px] text-gray-500">{excerpt}</p>
						)}
					</>
				</Link>
				{url && (
					<div className="mt-auto">
						<Link
							href={url || "#."}
							variant="permalink"
							aria-label={`${t("Nx:En savoir plus")}: ${title}`}
						>
							{t("Nx:En savoir plus")}
							<Icon id="arrow-right" className="rtl-icon" width="20" height="20" />
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
