import React, { useState } from "react"
import { useI18n, useNode } from "@vactorynext/core/hooks"
import { useForm } from "react-hook-form"
import { Button, Input, Wysiwyg } from "@/ui"
import get from "lodash.get"
import { drupal } from "@vactorynext/core/drupal"
import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import { toast } from "react-toastify"

export const config = {
	id: "vactory_otp:otp",
}

const AccountOtpWidget = ({ data }) => {
	const label = data?.field_label
	const first_step = {
		title: get(data, "components.0.group_first_step.title", null),
		description: get(data, "components.0.group_first_step.intro.value.#text", null),
	}
	const second_step = {
		title: get(data, "components.0.group_second_step.title", null),
		description: get(data, "components.0.group_second_step.intro.value.#text", null),
	}

	const { t } = useI18n()
	const router = useRouter()
	const { locale, query } = router
	const [loading, setLoading] = useState(false)
	const [otpSended, setOtpSended] = useState(false)
	const [uid, setUid] = useState(null)
	const [userInput, setUserInput] = useState("")

	const node = useNode()
	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors },
	} = useForm()

	const onSubmit = async (input) => {
		setLoading(true)
		const toastId = toast.loading(t("Nx:Loading..."))
		try {
			const res = await drupal.fetch(`${locale}/api/otp/generate/${input.field}`, {
				withAuth: false,
				method: "GET",
			})
			setLoading(false)
			toast.dismiss(toastId)

			if (res?.ok) {
				const response = await res.json()
				setUid(response?.uid)
				setUserInput(input.field)
				setValue("field", "")
				setOtpSended(true)
			} else {
				const response = await res.json()
				setError(
					"field",
					{
						type: "manual",
						message: response?.error_message,
					},
					{
						shouldFocus: true,
					}
				)
			}
		} catch (err) {
			toast.dismiss(toastId)
			toast.error(t("Nx:Une erreur s'est produite"))
			console.error(err)
		}
	}

	const onAuth = async (input) => {
		const otp = input?.otp
		try {
			const data = await signIn("otp", {
				redirect: false,
				uid: uid,
				otp: otp,
			})
			if (data?.ok) {
				router.push(query?.callbackUrl)
			} else {
				toast.error(t("Nx:Une erreur s'est produite"))
			}
		} catch {
			toast.error(t("Nx:Une erreur s'est produite"))
		}
	}

	const reSend = async () => {
		setLoading(true)
		const toastId = toast.loading(t("Nx:Loading..."))
		try {
			const res = await drupal.fetch(`${locale}/api/otp/generate/${userInput}`, {
				withAuth: false,
				method: "GET",
			})
			setLoading(false)
			toast.dismiss(toastId)
			if (res?.ok) {
				toast.success(t("Nx:OTP sent successfully"))
			} else {
				const response = await res.json()
				toast.error(response?.error_message)
			}
		} catch (err) {
			toast.dismiss(toastId)
			toast.error(t("Nx:Une erreur s'est produite"))
			console.error(err)
		}
	}

	return (
		<div className="relative px-4 sm:px-6 lg:px-8">
			{!otpSended ? (
				<>
					{(first_step?.title || first_step?.description) && (
						<div className="mb-6">
							{first_step?.title && (
								<h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
									{first_step?.title}
								</h2>
							)}
							{first_step?.description && (
								<div className="mx-auto mt-3 sm:mt-4">
									<Wysiwyg html={first_step?.description} />
								</div>
							)}
						</div>
					)}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
					>
						<input
							name="csrfToken"
							{...register("csrfToken")}
							type="hidden"
							defaultValue={node?.csrfTokenAuth}
						/>
						<div className="mb-4">
							<label
								className="mb-2 block text-sm font-bold text-gray-700"
								htmlFor="field"
							>
								{label}
							</label>
							<Input
								type="text"
								name="field"
								id="field"
								{...register("field", { required: "this field is required" })}
								hasError={errors.field}
								errorMessage={errors?.field?.message}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Button type="submit" disabled={loading}>
								{t("Nx:Submit")}
							</Button>
						</div>
					</form>
				</>
			) : (
				<>
					{(second_step?.title || second_step?.description) && (
						<div className="mb-6">
							{second_step?.title && (
								<h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
									{second_step?.title}
								</h2>
							)}
							{second_step?.description && (
								<div className="mx-auto mt-3 sm:mt-4">
									<Wysiwyg html={second_step?.description} />
								</div>
							)}
						</div>
					)}
					<form
						onSubmit={handleSubmit(onAuth)}
						className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
					>
						<input
							name="csrfToken"
							{...register("csrfToken")}
							type="hidden"
							defaultValue={node?.csrfTokenAuth}
						/>
						<div className="mb-4">
							<label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="otp">
								OTP
							</label>
							<Input
								type="text"
								name="otp"
								id="otp"
								{...register("otp", { required: "otp is required" })}
								hasError={errors.otp}
								errorMessage={errors?.otp?.message}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Button type="submit" disabled={loading}>
								{t("Nx:Submit")}
							</Button>
							<Button type="button" disabled={loading} onClick={reSend}>
								{t("Nx:re-send")}
							</Button>
						</div>
					</form>
				</>
			)}
		</div>
	)
}

export default AccountOtpWidget
