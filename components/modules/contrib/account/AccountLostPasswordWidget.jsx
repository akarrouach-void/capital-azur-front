import React, { Fragment, useState, useRef, useEffect } from "react"
import { useI18n, useAccount, useNode, useInViewport } from "@vactorynext/core/hooks"
import { useForm } from "react-hook-form"
import dynamic from "next/dynamic"
import { Button, Input, Icon, Wysiwyg, Heading, Text } from "@/ui"
import { Dialog, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import get from "lodash.get"
import { useFlag } from "@vactory/console/client"
import { toast } from "react-toastify"

const ReCaptcha = dynamic(() => import("react-google-recaptcha"), {
	ssr: false,
})

export const config = {
	id: "vactory_decoupled_espace_prive:lost-password",
}

const AccountLostPasswordWidget = ({ data }) => {
	const title = get(data, "components.0.title", null)
	const description = get(data, "components.0.intro.value.#text", null)
	const [recaptchaNeeded, setRecaptchaNeeded] = useState(false)
	const myRef = useRef()
	const { inViewport } = useInViewport(myRef)
	const { t, activeLocale } = useI18n()
	const { isAuthenticated, resetUserPassword } = useAccount()
	const [loading, setLoading] = useState(false)
	const [isModalOpen, setModalOpen] = useState(false)

	const node = useNode()
	const recaptchaRef = React.createRef()
	const recaptchaSiteKey = useFlag("captchaSiteKey")
	const {
		register,
		handleSubmit,
		setValue,
		clearErrors,
		setError,
		formState: { errors },
	} = useForm()

	useEffect(() => {
		if (inViewport && !recaptchaNeeded) {
			setRecaptchaNeeded(true)
		}
	}, [inViewport])

	const onSubmit = async (input) => {
		setLoading(true)
		const toastId = toast.loading("Loading...")
		try {
			await resetUserPassword({
				data: {
					type: "user--password-reset",
					attributes: {
						mail: input.email,
					},
				},
			})
			setLoading(false)
			toast.dismiss(toastId)
			setModalOpen(true)
		} catch (err) {
			toast.dismiss(toastId)
			toast.error(t("Nx:Une erreur s'est produite"))
			console.error(err)
		}
	}

	return isAuthenticated ? (
		<div className="flex min-h-full flex-col justify-center rounded-xl bg-white px-5 py-10 md:px-6 md:py-12">
			<Heading className="text-center text-gray-900" level={2}>
				{t("Nx:Already logged in")}
			</Heading>
		</div>
	) : (
		<div className="flex min-h-full flex-col justify-center rounded-xl bg-white px-5 py-10 md:px-6 md:py-12">
			{(title || description) && (
				<div className="mb-6 flex flex-col items-center gap-3">
					{title && (
						<Heading className="text-center text-gray-900" level={2}>
							{title}
						</Heading>
					)}
					{description && (
						<Wysiwyg
							html={description}
							className="prose !max-w-3xl text-center text-sm text-gray-900"
						/>
					)}
				</div>
			)}

			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 shadow-sm md:px-10 md:py-12">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<input
							name="csrfToken"
							{...register("csrfToken")}
							type="hidden"
							defaultValue={node?.csrfTokenAuth}
						/>
						<Input
							type="text"
							name="email"
							id="email"
							label={t("Nx:E-mail")}
							autoComplete="email"
							placeholder={t("Nx:Saisissez votre adresse mail")}
							{...register("email", { required: t("Nx:Email is required") })}
							hasError={errors.email}
							errorMessage={errors?.email?.message}
						/>
						<div className="relative flex flex-col" ref={myRef}>
							<input
								type="hidden"
								name="recaptchaResponse"
								{...register("recaptchaResponse", {
									required: t("Nx:Robot check required"),
								})}
							/>
							{recaptchaNeeded && (
								<ReCaptcha
									sitekey={recaptchaSiteKey}
									hl={activeLocale}
									ref={recaptchaRef}
									onChange={(val) => {
										setValue("recaptchaResponse", val)
										clearErrors("recaptchaResponse")
									}}
									onExpired={() => {
										setValue("recaptchaResponse", null)
										setError("recaptchaResponse", {
											type: "manual",
											message: t("Nx:Recaptcha Expired!"),
										})
									}}
									onErrored={() => {
										setError("recaptchaResponse", {
											type: "manual",
											message: t("Nx:Recaptcha Error!"),
										})
									}}
								/>
							)}
							{errors.recaptchaResponse && (
								<Text as="span" className="mt-2 text-xs text-error-500">
									{errors.recaptchaResponse.message}
								</Text>
							)}
						</div>
						<Button
							type="submit"
							className="w-full"
							variant="gradient"
							disabled={loading}
						>
							{t("Nx:Submit")}
						</Button>
					</form>
				</div>
			</div>
			<Modal open={isModalOpen} setOpen={setModalOpen} />
		</div>
	)
}

const Modal = ({ open, setOpen }) => {
	const { t } = useI18n()
	// const router = useRouter()
	// const [redirect, setRedirect] = useState(false)
	const closeModal = () => {
		setOpen(false)
		// setRedirect(true)
	}

	// useUpdateEffect(() => {
	// 	router.push(`/${router.locale}`)
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [redirect])

	return (
		<Transition show={open} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
				<div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</TransitionChild>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className="hidden sm:inline-block sm:h-screen sm:align-middle"
						aria-hidden="true"
					>
						&#8203;
					</span>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
							<div>
								<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
									<Icon
										id="check"
										className="h-6 w-6 text-success-600"
										aria-hidden="true"
									/>
								</div>
								<div className="mt-3 text-center sm:mt-5">
									<DialogTitle
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										{t("Nx:Password reset")}
									</DialogTitle>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											{t(
												"Nx:If the provided email corresponds to a valid account, you will receive an email containing instructions to reset your password."
											)}
										</p>
									</div>
								</div>
							</div>
							<div className="mt-5 sm:mt-6">
								<button
									type="button"
									className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
									onClick={closeModal}
								>
									{t("Nx:Close")}
								</button>
							</div>
						</div>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	)
}

export default AccountLostPasswordWidget
