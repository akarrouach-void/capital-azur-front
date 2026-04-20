import { Icon, Link } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

export const LoginInvite = ({ loginUrl, registerUrl, text, showHelpText }) => {
	const { t } = useI18n()
	return (
		<div className="shadow-1 wow fadeIn mt-8 overflow-hidden rounded-lg bg-white">
			<div className="mx-auto max-w-xl space-y-5 px-6 py-12 text-center">
				<Icon className="mx-auto h-16 w-16 text-primary" id="log-in" size="64" />
				<h3 className="mt-5 text-xl font-bold">{text}</h3>
				<div>
					{showHelpText && (
						<p className="mb-2 text-sm">
							{t("Vous n'êtes pas encore inscrit au portail ?")}
						</p>
					)}
					<Link
						href={registerUrl}
						className="text-sm text-primary underline hover:no-underline"
					>
						<Icon id="draw" className="inline-block h-3 w-3 ltr:mr-2 rtl:ml-2" />
						<span>{t("S'inscrire au portail")}</span>
					</Link>
				</div>
				<div>
					{showHelpText && (
						<p className="mb-2 text-sm">{t("Vous êtes déjà inscrit au portail ?")}</p>
					)}
					<Link
						href={loginUrl}
						className="text-sm text-primary underline hover:no-underline"
					>
						<Icon id="draw" className="inline-block h-3 w-3 ltr:mr-2 rtl:ml-2" />
						<span>{t("Se connecter au portail")}</span>
					</Link>
				</div>
			</div>
		</div>
	)
}
