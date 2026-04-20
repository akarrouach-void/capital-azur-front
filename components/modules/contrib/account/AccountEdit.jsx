import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useI18n, useAccount, useNode } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { drupal } from "@vactorynext/core/drupal"
import { Avatar, Button, Input } from "@/ui"
import { toast } from "react-toastify"

const errorFields = {
	"/data/attributes/mail": "email",
	"/data/attributes/mail/value": "email",
	"/data/attributes/field_first_name": "first_name",
	"/data/attributes/field_last_name": "last_name",
}

const EditProfilePage = ({ account }) => {
	const { t } = useI18n()
	const currentUser = account
	const router = useRouter()
	const locale = router.locale
	const { csrfTokenAuth } = useNode()
	const [loading, setLoading] = useState(false)
	const [loadingPhoto, setLoadingPhoto] = useState(false)
	const { updateUserSession } = useAccount()
	const [avatar, setAvatar] = useState(
		account?.user_picture?.uri?.value?._default || null
	)

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: currentUser?.mail || "",
			first_name: currentUser?.field_first_name || "",
			last_name: currentUser?.field_last_name || "",
		},
	})

	const onSubmit = async (input) => {
		setLoading(true)
		const toastId = toast.loading("Loading...")

		try {
			const response = await drupal.fetch(`${locale}/api/user/user/${currentUser.id}`, {
				withAuth: true,
				method: "PATCH",
				body: JSON.stringify({
					data: {
						type: "user--user",
						id: currentUser.id,
						attributes: {
							mail: input.email,
							field_first_name: input.first_name,
							field_last_name: input.last_name,
						},
					},
				}),
			})
			const data = await response.json()
			if (response.ok) {
				await updateUserSession()
				toast.dismiss(toastId)
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
		} catch (err) {
			setLoading(false)
			toast.dismiss(toastId)
			toast.error(t("Une erreur s'est produite"))
			console.error(err)
		}
	}

	const fileUploadHandler = (e) => {
		const file = e.target.files[0]
		const filename = file?.name
		if (!filename || filename.length <= 0) {
			return
		}

		const blobData = new FormData()
		blobData.append("image", file)
		setLoadingPhoto(true)
		drupal
			.upload(
				`/api/user/user/${currentUser.id}/user_picture`,
				{ locale, withAuth: true },
				filename,
				blobData
			)
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				setAvatar(data.data.uri.value._default)
				updateUserSession()
					.finally(() => {
						setLoadingPhoto(false)
					})
					.catch((error) => {
						setLoadingPhoto(false)
						console.error(error)
					})
			})
			.catch((error) => {
				setLoadingPhoto(false)
				console.error(error)
			})
	}

	const removePicture = () => {
		setLoadingPhoto(true)

		drupal
			.fetch(`${locale}/api/user/user/${currentUser.id}`, {
				withAuth: true,
				method: "PATCH",
				body: JSON.stringify({
					data: {
						type: "user--user",
						id: currentUser.id,
						relationships: {
							user_picture: {
								data: {},
							},
						},
					},
				}),
			})
			.then(() => {
				updateUserSession()
				setAvatar(null)
			})
			.catch((error) => {
				console.error(error)
			})
			.finally(() => {
				setLoadingPhoto(false)
			})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input
				name="csrfToken"
				{...register("csrfToken")}
				type="hidden"
				defaultValue={csrfTokenAuth}
			/>
			<div className="shadow sm:overflow-hidden sm:rounded-md">
				<div className="space-y-6 bg-white px-4 py-6 sm:p-6">
					<div>
						<h3 className="text-lg font-medium leading-6 text-gray-900">
							{t("Nx:Personal Information")}
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							{t("Nx:Use a permanent address where you can recieve mail.")}
						</p>
					</div>

					<div className="grid grid-cols-6 gap-6">
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="first-name"
								className="block text-sm font-medium text-gray-700"
							>
								{t("Nx:First name")}
							</label>
							<Input
								type="text"
								name="first-name"
								id="first-name"
								autoComplete="first-name"
								{...register("first_name", {
									required: t("Nx:First name is required"),
								})}
								hasError={errors.first_name}
								errorMessage={errors?.first_name?.message}
							/>
						</div>

						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="last-name"
								className="block text-sm font-medium text-gray-700"
							>
								{t("Nx:Last name")}
							</label>
							<Input
								type="text"
								name="last-name"
								id="last-name"
								autoComplete="last-name"
								{...register("last_name", { required: t("Nx:Last name is required") })}
								hasError={errors.last_name}
								errorMessage={errors?.last_name?.message}
							/>
						</div>

						<div className="col-span-6 sm:col-span-4">
							<label
								for="email-address"
								className="block text-sm font-medium text-gray-700"
							>
								{t("Nx:Email address")}
							</label>
							<Input
								type="text"
								name="email-address"
								id="email-address"
								autoComplete="email"
								{...register("email", { required: t("Nx:Email is required") })}
								hasError={errors.email}
								errorMessage={errors?.email?.message}
							/>
						</div>

						<div className="col-span-3">
							<label className="block text-sm font-medium text-gray-700">
								{t("Nx:Photo")}
							</label>
							<div className="mt-1 flex items-center">
								<span className="relative inline-block">
									{avatar ? (
										<Avatar src={avatar} size="xxlarge" alt="Me" />
									) : (
										<Avatar variant="placeholder" size="xxlarge" />
									)}
								</span>
								<div className="ml-4 flex">
									<div className="border-primary-gray-300 hover:bg-primary-gray-50 focus-within:ring-offset-primary-gray-50 relative flex cursor-pointer items-center rounded-md border bg-white px-3 py-2 shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
										<label
											for="user-photo"
											className="text-primary-gray-900 pointer-events-none relative text-sm font-medium"
										>
											<span>{loadingPhoto ? t("Nx:Uploading...") : t("Nx:Change")}</span>
											<span className="sr-only"> user photo</span>
										</label>
										<input
											id="user-photo"
											name="user-photo"
											disabled={loadingPhoto}
											type="file"
											onChange={fileUploadHandler}
											className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
										/>
									</div>
									{avatar ? (
										<button
											type="button"
											onClick={removePicture}
											className="text-primary-gray-900 hover:text-primary-gray-700 focus:border-primary-gray-300 focus:ring-offset-primary-gray-50 ml-3 rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
										>
											{t("Nx:Remove")}
										</button>
									) : (
										<></>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
					<Button type="submit" disabled={loading}>
						{t("Nx:Save")}
					</Button>
				</div>
			</div>
		</form>
	)
}

export default EditProfilePage
