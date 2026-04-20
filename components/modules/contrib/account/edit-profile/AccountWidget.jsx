import { deserialise } from "kitsu-core"
import get from "lodash.get"
import { useRouter } from "next/router"
import { Form } from "@/form"
import { useAccount, useI18n } from "@vactorynext/core/hooks"
import { Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import AccountEditPasswordPage from "./AccountEditPassword"
import { AccountEmprunt } from "./AccountEmprunt"

export const config = {
	id: "vactory_decoupled_espace_prive:account",
	lazy: true,
}

const AccountWidget = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})
	const user = deserialise(get(data, "components.0.user.data", {}))
	const user_data = user.data ?? {}
	const account = user_data[0] ?? {}
	const { isAuthenticated, updateUserSession, profile } = useAccount()
	const router = useRouter()
	const currentRoute = router.query?.p || "account"
	const has_password = profile?.user?.has_password
	const showEditPassword = currentRoute === "password" && has_password
	const showEditAccount =
		currentRoute === "account" || (currentRoute === "password" && !has_password)

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (buttons !== "") {
		buttons = JSON.parse(buttons)
	}

	if (!isAuthenticated) {
		return null
	}

	return (
		<ProfileLayout>
			{showEditAccount && (
				<div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 shadow-sm md:px-10 md:py-12">
					<Form
						webformId={webform_id}
						schema={elements}
						styles={{
							...style,
							submitButton: { className: "mt-5" },
						}}
						buttons={buttons}
						confirmeSubmit={async () => {
							await updateUserSession()
						}}
						reset={false}
					/>
				</div>
			)}
			{showEditPassword && (
				<div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 shadow-sm md:px-10 md:py-12">
					<AccountEditPasswordPage account={account} />
				</div>
			)}
			{currentRoute === "emprunt" && (
				<div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 shadow-sm md:px-10 md:py-12">
					<AccountEmprunt />
				</div>
			)}
		</ProfileLayout>
	)
}

const ProfileLayout = ({ children }) => {
	const router = useRouter()
	const { accountUrl, profile } = useAccount()
	const { t } = useI18n()
	// const locale = router.locale
	const currentRoute = router.query?.p || "account"

	let navigation = [
		{
			name: "Account",
			href: accountUrl,
			icon: "user-circle",
			current: currentRoute === "account",
		},

		{
			name: t("Biometerie"),
			href: `${accountUrl}?p=emprunt`,
			icon: "fingerprint",
			current: currentRoute === "emprunt",
		},
	]

	if (profile?.user?.has_password) {
		navigation = [
			...navigation,
			{
				name: "Password",
				href: `${accountUrl}?p=password`,
				icon: "key",
				current: currentRoute === "password",
			},
		]
	}

	return (
		<div className="min-h-full md:bg-white md:px-6 md:py-12">
			<div className="mx-auto max-w-7xl">
				<div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
					<aside className="px-2 py-6 sm:px-6 lg:col-span-3 lg:px-0 lg:py-0">
						<div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
							<nav className="space-y-2">
								{navigation.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className={vclsx(
											item.current
												? "bg-white text-primary-700 shadow-sm"
												: "text-gray-700 hover:bg-white hover:text-gray-900",
											"group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
										)}
										aria-current={item.current ? "page" : undefined}
									>
										<Icon
											id={item.icon}
											className={vclsx(
												item.current
													? "text-primary-500"
													: "text-gray-400 group-hover:text-gray-500",
												"mr-3 h-5 w-5 flex-shrink-0"
											)}
											aria-hidden="true"
										/>
										<span className="truncate">{item.name}</span>
									</Link>
								))}
							</nav>
						</div>
					</aside>

					<div className="mt-6 space-y-6 lg:col-span-9 lg:mt-0">{children}</div>
				</div>
			</div>
		</div>
	)
}

export default AccountWidget
