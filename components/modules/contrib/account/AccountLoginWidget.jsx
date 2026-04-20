import React, { useEffect, useState, useRef } from "react"
import get from "lodash.get"
import { signIn } from "next-auth/react"
import { useI18n, useNode, useInViewport } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { useForm, FormProvider } from "react-hook-form"
import { Button, Icon, Link, Input, InputPassword, Wysiwyg, Heading, Text } from "@/ui"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import dynamic from "next/dynamic"
import { useFlag } from "@vactory/console/client"

const ReCaptcha = dynamic(() => import("react-google-recaptcha"), {
	ssr: false,
})

export const config = {
	id: "vactory_decoupled_espace_prive:signin",
	lazy: true,
}

export const AccountLoginWidget = ({ data }) => {
	const title = get(data, "components.0.title", null)
	const description = get(data, "components.0.intro.value.#text", null)

	const [recaptchaNeeded, setRecaptchaNeeded] = useState(false)
	const myRef = useRef()
	const { inViewport } = useInViewport(myRef)
	const router = useRouter()
	const { locale } = router
	const callbackUrl = router?.query?.callbackUrl || `/${locale}`
	const { t, activeLocale } = useI18n()
	const { csrfTokenAuth, providers } = useNode()
	const recaptchaRef = React.createRef()
	const isNewUser = router?.query?.isNew || false
	const isCaptchaEnabled = useFlag("captcha")
	const recaptchaSiteKey = useFlag("captchaSiteKey")
	const methods = useForm()
	const {
		register,
		handleSubmit,
		setError,
		setValue,
		clearErrors,
		formState: { errors },
	} = methods

	useEffect(() => {
		// Prefetch the callback page
		if (router?.query?.callbackUrl) {
			const callbackUrl = router.query.callbackUrl
			const cleanUrl = callbackUrl.endsWith("/") ? callbackUrl.slice(0, -1) : callbackUrl
			router.prefetch(cleanUrl)
		}

		// Prefetch reset password & register page.
		// router.prefetch()
	}, [])

	useEffect(() => {
		if (inViewport && !recaptchaNeeded) {
			setRecaptchaNeeded(true)
		}
	}, [inViewport])

	const onSubmit = async (input) => {
		// Trim the input values
		const trimmedInput = {
			...input,
			username: input.username.trim(),
			password: input.password.trim(),
		}
		clearErrors()
		const res = await signIn("credentials", {
			redirect: false,
			callbackUrl,
			...trimmedInput,
		})
		if (res?.error) {
			setError(
				"username",
				{
					type: "manual",
					message: res?.error,
				},
				{
					shouldFocus: true,
				}
			)
		}
		if (res.url) router.push(res.url)
	}

	return (
		<FormProvider {...methods}>
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

				<Text
					variant="medium"
					className="mb-8 flex flex-col items-center font-medium text-gray-900"
				>
					<Text as="span" variant="medium">
						{t("Nx:Connectez-vous à votre compte")}
					</Text>
					<Text as="span" variant="medium">
						{t("Nx:Ou")}
					</Text>
					<Link
						href={`/${locale}${SYSTEM_ROUTES.account_register.path}`}
						className="text-primary-500 underline hover:text-primary-700"
					>
						{t("Nx:Créer un nouveau compte")}
					</Link>
				</Text>

				{isNewUser && <WelcomeNewUser />}

				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 shadow-sm md:px-10 md:py-12">
						<form method="post" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
							<input
								name="csrfToken"
								{...register("csrfToken")}
								type="hidden"
								defaultValue={csrfTokenAuth}
							/>
							<Input
								type="text"
								name="username"
								id="username"
								label={t("Nx:E-mail")}
								autoComplete="email"
								placeholder={t("Nx:Saisissez votre adresse mail")}
								{...register("username", { required: t("Nx:Email is required") })}
								hasError={errors?.username}
								errorMessage={errors?.username?.message}
							/>

							<InputPassword
								type="password"
								name="password"
								id="password"
								label={t("Nx:Password")}
								placeholder={t("Nx:Saisissez votre mot de passe")}
								applyValidations={false}
								{...register("password", { required: t("Nx:Password is required") })}
							/>
							<div className="relative flex flex-col" ref={myRef}>
								<input
									type="hidden"
									name="captcha"
									{...register("captcha", {
										required: t("Nx:Robot check required"),
									})}
								/>
								{recaptchaNeeded && isCaptchaEnabled && (
									<ReCaptcha
										sitekey={recaptchaSiteKey}
										hl={activeLocale}
										ref={recaptchaRef}
										onChange={(val) => {
											setValue("captcha", val)
											clearErrors("captcha")
										}}
										onExpired={() => {
											setValue("captcha", null)
											setError("captcha", {
												type: "manual",
												message: t("Nx:Recaptcha Expired!"),
											})
										}}
										onErrored={() => {
											setError("captcha", {
												type: "manual",
												message: t("Nx:Recaptcha Error!"),
											})
										}}
									/>
								)}
								{errors.captcha && (
									<Text as="span" className="mt-2 text-xs text-error-500">
										{errors.captcha.message}
									</Text>
								)}
							</div>
							<div className="flex flex-col gap-4">
								<Button type="submit" className="w-full" variant="gradient">
									{t("Nx:Submit")}
								</Button>

								<Link
									href={`/${locale}${SYSTEM_ROUTES.account_lost_password.path}`}
									className="text-xs text-primary-500 hover:text-primary-700"
								>
									{t("Nx:Forgot your password?")}
								</Link>
							</div>
						</form>
					</div>
					<div>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">
									{t("Nx:Ou continuer avec")}
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
							{Object.values(providers).map((provider) => (
								<div key={provider.id}>
									<Button onClick={() => signIn(provider.id)} className="w-full">
										{provider.name}
									</Button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</FormProvider>
	)
}

const WelcomeNewUser = () => {
	const { t } = useI18n()
	return (
		<div className="rounded-md bg-success-50 p-4">
			<div className="flex">
				<div className="flex-shrink-0">
					<Icon
						id="check-circle"
						className="h-5 w-5 text-success-400"
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3">
					<p className="text-sm font-medium text-success-800">
						{t("Nx:You have successfully signed up, please signin using the form below")}
					</p>
				</div>
				<div className="ml-auto pl-3">
					<div className="-mx-1.5 -my-1.5">
						<button
							type="button"
							className="inline-flex rounded-md bg-success-50 p-1.5 text-success-500 hover:bg-success-100 focus:outline-none focus:ring-2 focus:ring-success-600 focus:ring-offset-2 focus:ring-offset-success-50"
						>
							<span className="sr-only">Dismiss</span>
							<Icon id="x" className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AccountLoginWidget
