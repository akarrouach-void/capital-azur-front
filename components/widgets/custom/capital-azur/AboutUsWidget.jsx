import { Container, Wysiwyg, Heading } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:about-us",
}

const AboutUsWidget = ({ data }) => {
	const component = data?.components?.[0]
	const title = component?.title || ""
	const description = component?.description || ""
	const linkUrl = component?.link?.url || null
	const linkTitle = component?.link?.title || null

	return (
		<div className="px-6 py-14">
			<Container className="mx-auto flex max-w-5xl flex-col items-center text-center">
				<div className="mb-10 flex flex-col items-center gap-6">
					<span className="bg-main block h-[3px] w-16 shrink-0" />
					{title && (
						<Heading
							level={2}
							className="text-3xl font-extrabold uppercase leading-tight tracking-wide md:text-[42px]"
						>
							{title}
						</Heading>
					)}
				</div>

				{description && (
					<Wysiwyg
						html={description}
						className="mb-12 max-w-4xl text-[17px] leading-relaxed text-gray-600 md:text-[19px]"
					/>
				)}

				{linkUrl && linkTitle && (
					<a
						href={linkUrl}
						className="bg-main inline-block rounded px-10 py-4 text-base font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-blue-700"
					>
						{linkTitle}
					</a>
				)}
			</Container>
		</div>
	)
}

export default AboutUsWidget
