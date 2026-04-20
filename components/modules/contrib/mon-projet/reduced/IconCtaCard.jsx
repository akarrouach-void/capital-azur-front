import { Button, Icon, Image, Link, Wysiwyg } from "@/ui"

export const IconCtaCard = (props) => {
	const { item } = props
	return (
		<div>
			{item.title && (
				<h3 className="mb-5 text-xl font-light sm:text-2xl">{item.title}</h3>
			)}
			<div className="shadow-1 rounded-lg bg-white p-4 lg:p-7">
				<div className="flex flex-wrap items-center space-x-5 rtl:space-x-reverse">
					{item.image ? (
						<Image
							src={item.image}
							alt="image alt"
							fill
							className="h-20 w-20 rounded-full"
						/>
					) : (
						<Icon
							id={item.icon || "awb-square"}
							className="h-20 w-20 flex-none text-primary"
						/>
					)}

					<div className="flex-1">
						<Wysiwyg html={item.text} skipProcess={true} className="text-sm" />

						<Button
							as={Link}
							href={item?.link?.url}
							onClick={item?.link?.onClick}
							attributes={item?.link?.attributes}
							extraClassNames="mt-5 hidden xs:inline-flex"
						>
							{item?.link?.title}
						</Button>
					</div>

					<Button
						as={Link}
						href={item?.link?.url}
						onClick={item?.link?.onClick}
						attributes={item?.link?.attributes}
						extraClassNames="mt-5 inline-flex justify-between xs:hidden w-full"
					>
						{item?.link?.title}
					</Button>
				</div>
				{item.extraText && (
					<>
						<hr className="my-4 border-black/10 lg:my-5" />
						<Wysiwyg html={item.extraText} />
					</>
				)}
			</div>
		</div>
	)
}
