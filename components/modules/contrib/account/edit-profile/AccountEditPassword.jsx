import React, { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useI18n, useAccount, useNode } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { drupal } from "@vactorynext/core/drupal"
import { signOut } from "next-auth/react"
import { toast } from "react-toastify"
import { Button, InputPassword, Heading, Text } from "@/ui"

const errorFields = {
	"/data/attributes/pass": "current_password",
}

const EditProfilePasswordPage = ({ account }) => {
	const { t } = useI18n()
	const currentUser = account
	const router = useRouter()
	const locale = router.locale
	const { csrfToken } = useNode()
	const [loading, setLoading] = useState(false)
	const { loginUrl } = useAccount()

	const methods = useForm()
	const {
		register,
		handleSubmit,
		setError,
		watch,
		formState: { errors },
	} = methods

	const onSubmit = async (input) => {
		setLoading(true)
		const toastId = toast.loading("Loading...")

		try {
			const response = await drupal.fetch(`${locale}/api/user/user/${currentUser.id}`, {
				withAuth: true,
				method: "PATCH",
				headers: {
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					data: {
						id: currentUser.id,
						type: `user--user`,
						attributes: {
							pass: {
								value: input.new_password,
								existing: input.current_password,
							},
						},
					},
				}),
			})
			const data = await response.json()
			if (response.ok) {
				await signOut({ callbackUrl: loginUrl })
			} else {
				const errors = data?.errors || []
				errors.forEach((item) => {
					const field = errorFields[item?.source?.pointer] || undefined
					if (field) {
						setError(field, {
							type: "manual",
							message: item.detail,
						})
					} else {
						console.warn(item)
					}
				})
			}
			setLoading(false)
			toast.dismiss(toastId)
		} catch (err) {
			setLoading(false)
			toast.dismiss(toastId)
			toast.error(t("Nx:Une erreur s'est produite"))
			console.error(err)
		}
	}

	return (
		<FormProvider {...methods}>
			<div className="mb-6 flex flex-col items-start">
				<Heading className="text-center text-gray-900" level={3} variant={5}>
					{t("Nx:Password")}
				</Heading>
				<Text className="text-center text-sm text-gray-500">
					{t("Nx:Update your password")}
				</Text>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<input
					name="csrfToken"
					{...register("csrfToken")}
					type="hidden"
					defaultValue={csrfToken}
				/>

				<InputPassword
					type="password"
					name="current-password"
					id="current-password"
					label={t("Nx:Current Password")}
					placeholder={t("Nx:Enter your current password")}
					autoComplete="current-password"
					applyValidations={false}
					{...register("current_password", {
						required: t("Nx:Current password is required"),
					})}
					hasError={errors.current_password}
					errorMessage={errors.current_password?.message}
				/>

				<InputPassword
					type="password"
					name="new-password"
					id="new-password"
					label={t("Nx:New Password")}
					placeholder={t("Nx:Enter your new password")}
					autoComplete="new-password"
					applyValidations={false}
					{...register("new_password", {
						required: t("Nx:New password is required"),
					})}
					hasError={errors.new_password}
					errorMessage={errors.new_password?.message}
				/>

				<InputPassword
					type="password"
					name="confirm-password"
					id="confirm-password"
					label={t("Nx:Confirm Password")}
					placeholder={t("Nx:Confirm your new password")}
					autoComplete="new-password"
					applyValidations={false}
					{...register("confirm_password", {
						required: t("Nx:Confirm password is required"),
						validate: (value) =>
							value === watch("new_password") || t("Nx:Passwords do not match"),
					})}
					hasError={errors.confirm_password}
					errorMessage={errors.confirm_password?.message}
				/>

				<Button type="submit" className="w-full" variant="gradient" disabled={loading}>
					{t("Nx:Save")}
				</Button>
			</form>
		</FormProvider>
	)
}

export default EditProfilePasswordPage
