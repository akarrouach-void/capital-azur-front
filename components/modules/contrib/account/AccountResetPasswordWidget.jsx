import React from "react"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { useI18n, useAccount } from "@vactorynext/core/hooks"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { Button, Wysiwyg } from "@/ui"
import * as dayjs from "dayjs"
import get from "lodash.get"
import { toast } from "react-toastify"

export const config = {
	id: "vactory_decoupled_espace_prive:single-sign-on",
}

const AccountResetPasswordWidget = ({ data }) => {
	const { t } = useI18n()
	const title = get(data, "components.0.title", null)
	const description = get(data, "components.0.intro.value.#text", null)
	const router = useRouter()
	const { isAuthenticated } = useAccount()
	const { locale, query } = router
	// When rendering client side don't display anything until loading is complete
	if (isAuthenticated) return <>{t("Nx:Loading ...")}</>

	const login = async () => {
		try {
			const data = await signIn("one-time-login", {
				redirect: false,
				uid: query.uid,
				timestamp: query.timestamp,
				hash: query.hash,
			})
			if (data?.ok) {
				router.push(
					`/${locale}/${SYSTEM_ROUTES.account_forget_password.path}?hash=${query.hash}&timestamp=${query.timestamp}`
				)
			} else {
				toast.error(t("Une erreur s'est produite"))
			}
		} catch {
			toast.error(t("Une erreur s'est produite"))
		}
	}

	return (
		<div className="bg-gray-100">
			<div className="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
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
				<div className="mx-auto max-w-3xl">
					<div className="bg-white shadow sm:rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg font-medium leading-6 text-gray-900">
								{t("Connexion unique")}
							</h3>
							<div className="mt-2 sm:flex sm:items-start sm:justify-between">
								<div className="max-w-xl text-sm text-gray-500">
									<p>
										{t(
											"Il s'agit d'une connexion unique pour votre compte qui expirera le "
										)}{" "}
										<strong>
											{dayjs.unix(query.hash_expire).format("DD/MM/YYYY - HH[h]mm")}
										</strong>
										.{" "}
										{t(
											"Cliquez sur ce bouton pour vous connecter au site et changer votre mot de passe. Cet identifiant ne peut être utilisé qu'une fois."
										)}
									</p>
								</div>
								<div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
									<Button onClick={login}>{t("Se connecter")}</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AccountResetPasswordWidget
