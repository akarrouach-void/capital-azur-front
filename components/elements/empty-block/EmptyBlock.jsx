import { Icon, Heading } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

export const EmptyBlock = ({ message, icon }) => {
	const { t } = useI18n()
	return (
		<div className="mx-auto max-w-md text-center">
			<div className="relative mx-auto w-full max-w-[272px]">
				{icon || (
					<Icon id="search" width="100" height="100" className="mx-auto text-gray-400" />
				)}
			</div>
			<div>
				<Heading level="4" className="mb-6 mt-5 text-gray-900">
					{message || t("Nx:Aucune résultat trouvée")}
				</Heading>
			</div>
		</div>
	)
}
