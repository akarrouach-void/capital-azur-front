import { useEffect } from "react"
import { Container, Image, Heading, Text, Badge } from "@/ui"
import { normalizeNode } from "./../normalizer"
import { Comments } from "@/comments"
import { deserialise } from "kitsu-core"
import { drupal } from "@vactorynext/core/drupal"
import { useRouter } from "next/router"
import Cookies from "js-cookie"

const ForumNode = ({ node }) => {
	const normalizedNode = normalizeNode(deserialise(node))
	const router = useRouter()
	const locale = router.locale
	const alreadySeen = Cookies.get(`alreadyseen${normalizedNode.id}`)

	useEffect(() => {
		if (alreadySeen === undefined) {
			const sendData = async () => {
				await drupal.fetch(`${locale}/api/_updateNodeViewsCount/${normalizedNode.id}`, {
					withAuth: true,
					method: "PATCH",
				})
			}
			Cookies.set(`alreadyseen${normalizedNode.id}`, true)
			sendData()
		}
	}, [])

	return (
		<div className="min-h-screen">
			<Container className="py-8 lg:py-16">
				<article className="mx-auto max-w-4xl">
					{/* Header Section */}
					<div className="mb-6 lg:mb-12">
						<Heading level={1} variant={2} className="mb-8 text-center text-gray-900">
							{normalizedNode.title}
						</Heading>
					</div>

					{/* Expert Section */}
					{normalizedNode?.expert?.firstName && (
						<div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-lg lg:p-8">
							<div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
								{/* Expert Avatar */}
								{normalizedNode?.expert?.picture?.uri && (
									<div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl md:h-40 md:w-40">
										<Image
											src={normalizedNode.expert?.picture?.uri}
											alt={normalizedNode.expert?.picture?.alt}
											className="h-full w-full object-cover"
											fill
										/>
									</div>
								)}

								{/* Expert Info */}
								<div className="flex-1 text-center md:text-left">
									{normalizedNode?.expert?.firstName &&
										normalizedNode?.expert?.lastName && (
											<Heading level={3} variant={4} className="mb-2 text-gray-900">
												{normalizedNode?.expert?.firstName}{" "}
												{normalizedNode?.expert?.lastName}
											</Heading>
										)}

									{normalizedNode?.expert?.profession && (
										<Badge
											text={normalizedNode?.expert?.profession}
											className="mb-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md"
										/>
									)}

									{normalizedNode?.expert?.field_about_the_author && (
										<Text className="leading-relaxed text-gray-600">
											{normalizedNode?.expert?.field_about_the_author}
										</Text>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Content Section */}
					{normalizedNode?.body && (
						<div className="rounded-2xl bg-white p-6 shadow-xl lg:p-10">
							{normalizedNode?.body}
						</div>
					)}

					{/* Comments Section */}
					<div className="mt-8 lg:mt-10">
						<Comments
							entity_id={node.id}
							content_type="vactory_news"
							field_name="comment"
							settings={node?.internal_comment}
							btn_label="poster un commentaire"
						/>
					</div>
				</article>
			</Container>
		</div>
	)
}

export const config = {
	id: "node--vactory_forum",
	params: {
		fields: {
			"node--vactory_forum":
				"body,created,title,field_vactory_forum_status,field_vactory_date,field_vactory_excerpt,field_forum_editeur,field_forum_expert,field_vactory_forums_thematic,field_vactory_media,internal_comment,node_banner_image,node_banner_mobile_image,node_banner_title,node_banner_description,node_banner_showbreadcrumb,node_summary",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--vactory_forums_thematic": "name",
			"user--user":
				"field_first_name,field_last_name,field_user_profession,field_about_the_author,user_picture",
		},
		include:
			"field_vactory_forums_thematic,field_vactory_media,field_vactory_media.thumbnail,field_forum_editeur,field_forum_expert,field_forum_expert.user_picture,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default ForumNode
