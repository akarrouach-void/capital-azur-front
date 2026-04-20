import React from "react"
import { Wysiwyg, Container, Link, Heading } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

const SeoNode = ({ node }) => {
	const { t } = useI18n()

	return (
		<Container>
			<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
				<div className="mb-6 text-xl font-bold">
					<h1>{node?.title}</h1>
				</div>

				<Wysiwyg className={"prose max-w-none"} html={node?.body?.value} />
			</div>
			<Link
				href={node?.field_vactory_call_to_action?.uri}
				variant="permalink"
				className="mb-3"
			>
				<span className="">{node?.field_vactory_call_to_action?.title}</span>
			</Link>

			{node?.seo_search_result?.map((item) => (
				<li
					key={item.url}
					className="mb-5 flex flex-col gap-5 rounded-md border border-primary-200 p-5 shadow-md lg:flex-row lg:content-center lg:items-center lg:justify-between lg:px-6 lg:py-8"
				>
					<div className="relative mb-2 focus-within:ring-2 focus-within:ring-primary-500">
						<Heading variant={5}>
							<Link href={item.url}>
								{/* Extend touch target to entire panel */}
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
		</Container>
	)
}

export const config = {
	id: "node--vactory_seo",
	params: {
		fields: {
			"node--vactory_seo":
				"drupal_internal__nid,title,body,field_vactory_call_to_action,seo_search_result",
		},
	},
}

export default SeoNode
