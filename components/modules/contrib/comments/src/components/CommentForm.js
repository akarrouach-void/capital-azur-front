import { Button, Heading, Input, Textarea } from "@/ui"
import React from "react"
import { useForm } from "react-hook-form"
import dynamic from "next/dynamic"
import { drupal } from "@vactorynext/core/drupal"
import { useRouter } from "next/router"
import { useI18n, useAccount, useNode } from "@vactorynext/core/hooks"
import { useFlag } from "@vactory/console/client"
import { toast } from "react-toastify"

const Recaptcha = dynamic(() => import("react-google-recaptcha"), {
	ssr: false,
})

export const CommentForm = ({
	entity_id,
	pid = null,
	content_type,
	field_name,
	btn_label = "poster un commentaire",
	settings = {},
}) => {
	const {
		reset,
		register,
		handleSubmit,
		setError,
		setValue,
		clearErrors,
		formState: { isSubmitting, errors },
	} = useForm()
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const { profile, isAuthenticated } = useAccount()
	const recaptchaRef = React.createRef()
	const recaptchaSiteKey = useFlag("captchaSiteKey")
	const { csrfToken } = useNode()

	const onSubmit = async (data) => {
		clearErrors()
		try {
			let parent = null
			if (pid !== null) {
				parent = {
					type: `comment--comment`,
					id: pid,
				}
			}

			let comment = {
				type: `comment--comment`,
				attributes: {
					subject: data.objet,
					entity_type: "node",
					field_name: field_name,
					comment_body: {
						value: data.comment,
						format: "plain_text",
					},
				},
				relationships: {
					entity_id: {
						data: {
							type: `node--${content_type}`,
							id: entity_id,
						},
					},
					pid: {
						data: parent,
					},
				},
			}

			if (isAuthenticated) {
				comment = {
					...comment,
					uid: {
						data: {
							type: "user--user",
							id: profile?.user?.uuid,
						},
					},
				}
			} else {
				comment = {
					...comment,
					attributes: {
						...comment.attributes,
						name: data?.name,
						"g-recaptcha-response": data["g-recaptcha-response"],
					},
				}
			}

			const response = await drupal.fetch(`api/comment/comment`, {
				withAuth: true,
				method: "POST",
				body: JSON.stringify({
					data: comment,
				}),
				headers: {
					"X-CSRF-Token": csrfToken,
				},
			})
			if (response.ok) {
				reset()
				toast.success(t("Nx:Votre commentaire est en attente d'approbation"))
			} else {
				toast.warning(
					t("Nx:Votre commentaire n'a pas pu être soumis veuillez réessayer plus tard!")
				)
			}
		} catch {
			toast.error(
				t("Nx:Votre commentaire n'a pas pu être soumis veuillez réessayer plus tard!")
			)
		}
	}

	return (
		<>
			{settings?.settings?.status == 2 ? (
				<>
					<Heading level={4} className="mb-4">
						{t("Nx:Ajouter un commentaire")}
					</Heading>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="border-secondary rounded-md border bg-primary-50 p-4"
					>
						{!isAuthenticated ? (
							<Input
								label={t("Nx:Name")}
								variant="default"
								placeholder="Name"
								type="text"
								{...register(
									"name",
									settings?.settings?.anonymous == 2 ? { required: true } : {}
								)}
								name="name"
							/>
						) : null}

						<Input
							label={t("Nx:Objet")}
							variant="default"
							placeholder="Objet"
							type="text"
							{...register("objet", { required: "le champ object est requis." })}
							name="objet"
						/>
						{errors.objet && (
							<p className="mb-3 text-sm text-error-600">{errors.objet.message}</p>
						)}
						<Textarea
							label={t("Nx:Comment")}
							variant="default"
							placeholder="Comment"
							type="text"
							{...register("comment", { required: "le champ comment est requis." })}
							name="comment"
							rows={5}
						/>
						{errors.comment && (
							<p className="mb-3 text-sm text-error-600">{errors.comment.message}</p>
						)}
						{!isAuthenticated && (
							<Recaptcha
								sitekey={recaptchaSiteKey}
								hl={locale}
								ref={recaptchaRef}
								onChange={(val) => {
									setValue("g-recaptcha-response", val)
									clearErrors("g-recaptcha-response")
								}}
								onExpired={() => {
									setValue("g-recaptcha-response", null)
									setError("g-recaptcha-response", {
										type: "manual",
										message: t("Nx:Recaptcha Expired!"),
									})
								}}
								onErrored={() => {
									setError("g-recaptcha-response", {
										type: "manual",
										message: t("Nx:Recaptcha Error!"),
									})
								}}
							/>
						)}

						{errors["g-recaptcha-response"] && (
							<p className="mt-2 text-sm text-error-600">
								{errors["g-recaptcha-response"].message}
							</p>
						)}
						<Button type="submit" disabled={isSubmitting} className="mt-4">
							{t(`Nx:${btn_label}`)}
						</Button>
					</form>
				</>
			) : null}
		</>
	)
}
