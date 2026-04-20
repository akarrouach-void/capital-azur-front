import { Heading, Text, Link, Wysiwyg } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_seo:search",
}

const SeoSearchWidget = ({ data }) => {
	const { title, description, seo_search } = data?.components[0]
	const { t } = useI18n()

	return (
		<>
			{title && <Heading> {title} </Heading>}
			{description && <Text> {description} </Text>}
			{seo_search?.map((item) => (
				<li
					key={item.url}
					className="mb-5 flex flex-col gap-5 rounded-md border border-primary-200 p-5 shadow-md lg:flex-row lg:content-center lg:items-center lg:justify-between lg:px-6 lg:py-8"
				>
					<div className="relative mb-2 focus-within:ring-2 focus-within:ring-primary-500">
						<Heading variant={5}>
							<Link href={item.url}>
								<span className="absolute inset-0" aria-hidden="true" />
								{item.title}
							</Link>
						</Heading>
						<Wysiwyg
							className="mt-1 line-clamp-2 text-base text-gray-600"
							html={item.excerpt}
						/>
					</div>
					<Link href={item.url} variant="permalink" className="shrink-0">
						{t("Nx:Lire plus")}
					</Link>
				</li>
			))}
		</>
	)
}

export default SeoSearchWidget
