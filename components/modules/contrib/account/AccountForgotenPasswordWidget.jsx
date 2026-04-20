import React, { useState } from "react"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { useI18n, useAccount, useNode } from "@vactorynext/core/hooks"
import { useForm } from "react-hook-form"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { Button, Input, Wysiwyg } from "@/ui"
import { drupal } from "@vactorynext/core/drupal"
import get from "lodash.get"
import { toast } from "react-toastify"

export const config = {
	id: "vactory_decoupled_espace_prive:forget-password",
	lazy: true,
}

const AccountForgotenPasswordWidget = ({ data }) => {
	const { t } = useI18n()
	const title = get(data, "components.0.title", null)
	const description = get(data, "components.0.intro.value.#text", null)
	const { profile } = useAccount()
	const router = useRouter()
	const { query, locale } = router
	const { csrfTokenAuth } = useNode()
	const [loading, setLoading] = useState(false)
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm()

	const onSubmit = async (input) => {
		setLoading(true)
		const toastId = toast.loading(t("Loading..."))

		try {
			const response = await drupal.fetch(
				`${locale}/api/user/${profile?.user?.uuid}/password/update`,
				{
					withAuth: false,
					method: "PATCH",
					body: JSON.stringify({
						data: {
							id: profile?.user?.uuid,
							type: `user--user`,
							attributes: {
								timestamp: query.timestamp,
								hash: query.hash,
								pass: input.new_password,
							},
						},
					}),
				}
			)
			const data = await response.json()
			if (response.ok) {
				await signOut({
					callbackUrl: `/${locale}${SYSTEM_ROUTES.account_login.path}`,
				})
			} else {
				const errors = data?.errors || []
				errors.forEach(() => {
					// @Todo
				})
			}
			setLoading(false)
			toast.dismiss(toastId)
		} catch (err) {
			setLoading(false)
			toast.dismiss(toastId)
			toast.error(t("Une erreur s'est produite"))
			console.error(err)
		}
	}

	return (
		<div className="mx-auto mt-[50px] w-[500px] bg-gray p-[50px]">
			<div className="mb-[33px]">
				{(title || description) && (
					<div className="mb-6">
						{title && (
							<h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
								{title}
							</h2>
						)}
						{description && (
							<div className="mx-auto mt-3 sm:mt-4">
								<Wysiwyg html={description} />
							</div>
						)}
					</div>
				)}
			</div>
			<div className="flex flex-col gap-y-[32px] sm:mx-auto">
				<form onSubmit={handleSubmit(onSubmit)}>
					<input
						name="csrfToken"
						{...register("csrfToken")}
						type="hidden"
						defaultValue={csrfTokenAuth}
					/>
					<div className="space-y-[30px] px-4">
						<div className="flex flex-col gap-y-6">
							<div>
								<Input
									type="password"
									{...register("new_password", {
										required: t("Le nouveau mot de pass est requis"),
									})}
									hasError={errors?.new_password ? true : false}
									errorMessage={errors?.new_password?.message}
									label={t("Nouveau mot de passe")}
								></Input>
							</div>
							<div>
								<Input
									type="password"
									{...register("confirm_password", {
										required: t("Confirm password is required"),
										validate: (value) =>
											value === watch("new_password") ||
											t("Le mot de passe est invalide."),
									})}
									hasError={errors?.confirm_password ? true : false}
									errorMessage={errors?.confirm_password?.message}
									label={t("Confirmer mot de passe")}
								></Input>
							</div>
						</div>
						<div className="text-right">
							<div className="text-right">
								<Button type="submit" disabled={loading}>
									{t("Modifier")}
								</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AccountForgotenPasswordWidget
