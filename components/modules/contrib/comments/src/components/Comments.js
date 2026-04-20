import {
	Pagination,
	Container,
	LoadingOverlay,
	Link,
	Wysiwyg,
	Button,
	Heading,
	Image,
} from "@/ui"
import { deserialise } from "kitsu-core"
import get from "lodash.get"
import { useRouter } from "next/router"
import React, { useLayoutEffect, useState } from "react"

import { drupal } from "@vactorynext/core/drupal"
import { useI18n, useAccount } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

import { GetUserCommentPermissions } from "./../helpers/CheckUserPermissions"
import DefaultCommentAvatar from "/public/assets/img/avatar-default.png"
import { CommentChild } from "./CommentChild"
import { CommentForm } from "./CommentForm"

export const Comment = ({ comment, entity }) => {
	const [showReplies, setShowReplies] = useState(false)
	const [reply, setReply] = useState(false)
	const { t } = useI18n()

	return (
		<>
			<div
				className={vclsx(
					"mb-5 rounded-md border px-3 py-4 md:px-6 md:py-5 xl:px-8 xl:py-8",
					comment.isOwner && "border-primary"
				)}
			>
				<div className="flex items-center gap-3 pb-4 md:gap-6">
					<div className="aspect[40/40] relative h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded-full border border-primary">
						<Image
							width={40}
							height={40}
							src={comment?.picture?.src}
							alt="User picture"
						/>
					</div>
					<div>
						<p>{comment.changed}</p>
						<p>
							Commented by{" "}
							<b className="underline">
								{comment.fullName == null ? "Anonyme" : comment.fullName}
							</b>
						</p>
					</div>
				</div>
				<div className="pl-12 not-last-child:mb-4 md:pl-16">
					<p>
						<b>{comment.subject}</b>
					</p>
					<Wysiwyg html={comment.body} prose={true} className="max-w-none" />
				</div>

				{!comment.isChild &&
				entity?.settings?.settings?.status == 2 &&
				comment.postComment ? (
					<Button onClick={() => setReply((prevState) => !prevState)} className="mr-4">
						{t("Nx:Répondre")}
					</Button>
				) : null}

				{comment.hasChilds ? (
					<Button
						variant="secondary"
						type="button"
						onClick={() => setShowReplies(!showReplies)}
					>
						{showReplies ? (
							<>{t("Nx:Cacher les réponses")}</>
						) : (
							<>{t("Nx:Afficher les réponses") + " : " + comment.replyCount}</>
						)}
					</Button>
				) : null}
			</div>
			{showReplies && comment.hasChilds ? <CommentChild entity={entity} /> : null}
			{reply ? (
				<div className="mb-5 pl-4 md:pl-8 xl:pl-10">
					<CommentForm {...entity} />
				</div>
			) : null}
		</>
	)
}

export const Comments = ({
	entity_id,
	content_type,
	field_name = "comment",
	btn_label = "poster un commentaire",
	settings = {},
}) => {
	const [isLoading, setIsLoading] = useState(false)
	const [comments, setComments] = useState([])
	const [count, setCount] = useState(0)
	const router = useRouter()
	const locale = router.locale
	const { registerUrl, loginUrl, profile, isAuthenticated } = useAccount()
	const { t } = useI18n()
	const [pager, setPager] = useState(1)
	const userCommentPermissions = GetUserCommentPermissions(settings?.settings?.roles)
	const defaultPageLimit = settings?.settings?.per_page
		? settings?.settings?.per_page
		: 20
	const fetchComments = async () => {
		const controller = new AbortController()
		setIsLoading(true)
		try {
			const response = await drupal.fetch(
				`${locale}/api/comment/comment?fields[comment--comment]=id,drupal_internal__cid,thread,status,internal_user,entity_id,langcode,subject,comment_body,created,changed,pid,extra_data,name&filter[entity_id][condition][path]=entity_id.id&filter[entity_id][condition][operator]=%3D&filter[entity_id][condition][value]=${entity_id}&filter[status][value]=1&page[limit]=${defaultPageLimit}&page[offset]=${
					(pager - 1) * defaultPageLimit
				}&sort=-thread&include=pid&&filter[parentOnly][condition][path]=pid&filter[parentOnly][condition][operator]=IS NULL`,
				{
					withAuth: true,
					method: "GET",
					signal: controller.signal,
				}
			)

			const data = await response.json()
			setComments(deserialise(data)?.data || [])
			setCount(data.meta.count)
		} catch (err) {
			console.error("err", err)
		} finally {
			setIsLoading(false)
		}
		return () => controller.abort()
	}

	useLayoutEffect(() => {
		fetchComments()
	}, [pager, entity_id])

	const handlePageChange = (pid) => {
		setPager(pid)
	}

	return settings?.contributions !== undefined ? (
		<>
			{userCommentPermissions?.view_comments ? (
				<>
					{comments.length > 0 ? (
						<LoadingOverlay active={isLoading} spinner={true} minHeight="none">
							<div className="mt-6 rounded-2xl bg-gray-50 p-8 lg:mt-12 lg:p-12">
								<Heading level={4}>
									{settings?.contributions} {t("Nx:Commentaires")}
									<div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
								</Heading>
								{comments.map((comment) => (
									<React.Fragment key={comment.id}>
										<Comment
											comment={{
												subject: comment.subject,
												body: get(comment, "comment_body.value", null),
												changed: comment.changed,
												fullName:
													get(comment, "internal_user.uid.id", "") === "0"
														? get(comment, "name", null)
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
												isChild: false,
												postComment: userCommentPermissions?.post_comment,
											}}
											entity={{
												entity_id: entity_id,
												content_type: content_type,
												field_name: field_name,
												btn_label: btn_label,
												pid: comment.id,
												settings: settings,
											}}
										/>
									</React.Fragment>
								))}
							</div>

							{parseInt(count) > parseInt(defaultPageLimit) && (
								<Container className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
									<Pagination
										pageSize={defaultPageLimit}
										current={pager}
										total={count}
										onChange={(page) => handlePageChange(page)}
										id="comments-pagination"
									/>
								</Container>
							)}
						</LoadingOverlay>
					) : null}
				</>
			) : null}

			{userCommentPermissions?.post_comment ? (
				<>
					<CommentForm
						entity_id={entity_id}
						content_type={content_type}
						uid={parseInt(1)}
						btn_label={btn_label}
						field_name={field_name}
						settings={settings}
					/>
				</>
			) : null}

			{!isAuthenticated && !userCommentPermissions?.post_comment ? (
				<div
					className="flex items-center rounded-md border border-primary px-4 py-3 text-sm font-bold"
					role="alert"
				>
					<svg
						className="mr-2 h-6 w-6 rounded-full border border-primary bg-primary fill-current p-1 text-white"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
					>
						<path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
					</svg>
					<p>
						<Link href={loginUrl} className="text-primary underline">
							{t("Nx:Sign in")}
						</Link>{" "}
						ou{" "}
						<Link href={registerUrl} className="text-primary underline">
							{t("Nx:S'inscrire")}
						</Link>{" "}
						{t("Nx:pour poster un commentaire")}{" "}
					</p>
				</div>
			) : null}
		</>
	) : null
}
