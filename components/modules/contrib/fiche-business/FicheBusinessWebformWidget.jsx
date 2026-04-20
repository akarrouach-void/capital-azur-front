import get from "lodash.get"
import { Wysiwyg } from "@/ui"
import { useI18n, useAccount } from "@vactorynext/core/hooks"
import { Link } from "@/ui"
import { useRouter } from "next/router"
import { LoginInvite } from "@/ui"
import dynamic from "next/dynamic"
const Form = dynamic(() => import("@/form").then((mod) => mod.Form), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export const config = {
	id: "vactory_business:webform",
	lazy: true,
}

export const FicheBusinessWebformWidget = ({ data }) => {
	const router = useRouter()
	const { locale } = router
	const { t } = useI18n()
	const { isAuthenticated, loginUrl, registerUrl } = useAccount()
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})
	const title = get(data, "extra_field.title", null)
	const description = get(data, "extra_field.intro.value.#text", null)
	const link = get(data, "extra_field.link.url", null)
	const link_label = get(data, "extra_field.link.title", null)
	let fiche_alias = get(data, "extra_field.fiche_alias", null)
	fiche_alias = fiche_alias ? `${locale}${fiche_alias}` : fiche_alias

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (buttons !== "") {
		buttons = JSON.parse(buttons)
	}

	if (!isAuthenticated)
		return (
			<LoginInvite
				loginUrl={loginUrl}
				registerUrl={registerUrl}
				text={t(
					"Pour créer une fiche business, veuillez vous connecter à votre espace privé."
				)}
				showHelpText={true}
			/>
		)

	return (
		<div className="my-10">
			{title ||
				(description && (
					<div className="mb-12 text-center">
						{title && (
							<h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
								{title}
							</h2>
						)}
						{description && (
							<div className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
								<Wysiwyg html={description} />
							</div>
						)}
					</div>
				))}
			{fiche_alias && (
				<Link href={fiche_alias} variant="permalink">
					{t("Nx:Voir ma fiche business")}
				</Link>
			)}
			{elements && (
				<Form webformId={webform_id} schema={elements} styles={style} buttons={buttons} />
			)}
			{link && (
				<div className="mt-12 flex justify-center">
					<Link
						href={link}
						className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					>
						{link_label}
					</Link>
				</div>
			)}
		</div>
	)
}

export default FicheBusinessWebformWidget
