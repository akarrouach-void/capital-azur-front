import { Layer, Button, Text, Heading } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

export const ModaleCloseVideoAsk = ({ isShow = true, handleCancel, hancleclose }) => {
	const { t } = useI18n()
	return (
		<Layer modal={true} isShow={isShow} className="z-[99999999]" onClose={handleCancel}>
			<div className="max-w-[480px] bg-white px-8 py-9" id="modal-close-video-ask">
				<Heading level="2" variant="6">
					{t("Nx:Dommage...")}
				</Heading>
				<Text variant="small" className="mb-4">
					{t(
						"Nx:Nous aurions souhaité faire plus ample connaissance, on vous le reposera par la suite si vous en avez besoin"
					)}
				</Text>
				<div className="flex items-center justify-end gap-4">
					<Button outline={true} onClick={handleCancel}>
						{t("Nx:annuler")}
					</Button>
					<Button onClick={hancleclose} id="modal-close-video-ask-confirm">
						{t("Nx:Confirmer")}
					</Button>
				</div>
			</div>
		</Layer>
	)
}
