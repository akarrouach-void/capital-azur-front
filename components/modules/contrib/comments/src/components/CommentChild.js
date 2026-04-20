import React, { useLayoutEffect, useState } from "react"
import { drupal } from "@vactorynext/core/drupal"
import { useRouter } from "next/router"
import { deserialise } from "kitsu-core"
import { Container, LoadingOverlay } from "@/ui"
import get from "lodash.get"
import DefaultCommentAvatar from "/public/assets/img/avatar-default.png"
import { Comment } from "./Comments"
import { useAccount } from "@vactorynext/core/hooks"

export const CommentChild = ({ entity }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [comments, setComments] = useState([])
	const router = useRouter()
	const locale = router.locale
	const { profile, isAuthenticated } = useAccount()

	const fetchCommentChild = async () => {
		const controller = new AbortController()
		setIsLoading(true)
		try {
			const response = await drupal.fetch(
				`${locale}/api/comment/comment?fields[comment--comment]=id,drupal_internal__cid,thread,status,internal_user,entity_id,langcode,subject,comment_body,created,changed,pid,extra_data,name&filter[status][value]=1&filter[parent_filter][condition][path]=pid.id&filter[parent_filter][condition][operator]=IN&filter[parent_filter][condition][value]=${entity.pid}&include=pid`,
				{
					withAuth: true,
					method: "GET",
					signal: controller.signal,
				}
			)

			const data = await response.json()
			setComments(deserialise(data)?.data || [])
		} catch (err) {
			console.error("err", err)
		} finally {
			setIsLoading(false)
		}
		return () => controller.abort()
	}

	useLayoutEffect(() => {
		fetchCommentChild()
	}, [])
	return (
		<>
			{comments.length > 0 ? (
				<LoadingOverlay active={isLoading} spinner={true}>
					<div className="relative mb-5 pl-4 md:pl-8 xl:pl-10">
						<Container>
							{comments.map((comment) => (
								<React.Fragment key={comment.id}>
									<Comment
										comment={{
											subject: comment.subject,
											body: get(comment, "comment_body.value", null),
											changed: comment.changed,
											fullName:
												get(comment, "internal_user.uid.id", "") === "0"
													? get(comment, "name")
													: get(comment, "internal_user.uid.full_name", null),

											picture: get(
												comment,
												"internal_user.uid.picture._default",
												DefaultCommentAvatar
											),
											hasChilds: get(comment, "extra_data.hasChilds", false),
											replyCount: get(comment, "extra_data.count", 0),
											isOwner:
												isAuthenticated &&
												get(comment, "internal_user.uid.id", null) == profile?.user?.id
													? true
													: false,
											isChild: true,
										}}
										entity={entity}
									/>
								</React.Fragment>
							))}
						</Container>
					</div>
				</LoadingOverlay>
			) : null}
		</>
	)
}
