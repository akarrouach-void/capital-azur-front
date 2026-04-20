import { Container, Badge, Text, Wysiwyg, Image, Flag, Heading, Icon } from "@/ui"
import { normalizeNode } from "./normalizer.js"
import { useI18n } from "@vactorynext/core/hooks"
import ImageNotFound from "public/assets/img/image-not-found.png"

const TestimonialNode = ({ node }) => {
	const { title, image, category, date, excerpt, body, isFlagged, hasFlag, id } =
		normalizeNode(node)
	const { t } = useI18n()

	return (
		<div className="min-h-screen">
			<Container className="py-8 lg:py-16">
				<article className="mx-auto max-w-4xl">
					{/* Header Section */}
					<div className="mb-6 lg:mb-12">
						<Heading level={2} variant={3} className="mb-8 text-center text-gray-900">
							{title}
						</Heading>

						{/* Meta Information */}
						<div className="mb-6 flex flex-wrap items-center justify-center gap-4">
							{category && (
								<Badge
									text={category}
									className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700"
								/>
							)}

							{date && (
								<div className="flex items-center gap-2 text-gray-600">
									<Icon id="calendar" className="h-4 w-4" />
									<Text variant="small" className="font-medium text-gray-600">
										{date}
									</Text>
								</div>
							)}

							{hasFlag && (
								<div className="flex items-center gap-2 text-gray-600">
									<Flag
										id={id}
										module="default_flag"
										className="cursor-pointer transition-colors hover:text-red-500"
										isFlagged={isFlagged}
									/>
									<span className="text-sm font-medium">
										{t("Nx:Ajouter a ma liste")}
									</span>
								</div>
							)}
						</div>

						{/* Hero Image */}

						<div className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl">
							<div className="aspect-[16/9] bg-gray-100">
								<Image
									src={image?.uri?.value?._default || ImageNotFound?.src}
									alt={image?.meta?.alt || "Image not found"}
									width={image?.meta?.width || ImageNotFound?.width}
									height={image?.meta?.height || ImageNotFound?.height}
									title={title}
									className="h-full w-full object-cover"
								/>
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
						</div>
					</div>

					{/* Excerpt Section */}
					{excerpt && (
						<div className="mb-8 rounded-2xl bg-gray-50 p-6 shadow-lg lg:p-8">
							<Wysiwyg html={excerpt} className="prose" />
						</div>
					)}

					{/* Content Section */}
					<div className="rounded-2xl bg-white p-6 shadow-xl lg:p-10">
						{body && <Wysiwyg html={body} className="prose" />}
					</div>
				</article>
			</Container>
		</div>
	)
}

export const config = {
	id: "node--vactory_testimonials",
	params: {
		fields: {
			"node--vactory_testimonials":
				"title,field_vactory_address,body,field_vactory_date,field_vactory_excerpt,field_vactory_media,field_vactory_profils,field_vactory_role,field_vactory_tags,node_banner_image,node_banner_mobile_image,node_banner_title,node_banner_description,node_banner_showbreadcrumb,node_summary",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--tags": "name",
			"taxonomy_term--vactory_testimonials_profils": "name",
		},
		include:
			"field_vactory_profils,field_vactory_tags,field_vactory_media,field_vactory_media.thumbnail,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default TestimonialNode
