import React, { useState, useRef } from "react"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { LoadingOverlay, Button, Countdown } from "@/ui"
import { drupal } from "@vactorynext/core/drupal"
import { useI18n } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_tender:download",
}

const TenderDownloadWidget = () => {
	const [isLoading, setIsLoading] = useState(false)
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const [fileUrl, setFileUrl] = useState("")
	const [Error, setError] = useState()
	const sid = router.query.crypted_sid
	const linkRef = useRef(null)
	const loadfile = async () => {
		setIsLoading(true)
		try {
			const response = await drupal.fetch(`/${locale}/api/submission/${sid}`, {
				withAuth: true,
				method: "GET",
			})
			const fileUri = await response.json()
			if (!fileUri?.message?.startsWith("Error")) {
				setFileUrl(fileUri)
			} else {
				setError("Error")
			}
		} catch (err) {
			console.log("err", err)
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		loadfile()
	}, [])

	return (
		<>
			<div className="text-center">
				<LoadingOverlay isLoading={isLoading}>
					<div>
						<Countdown
							seconds={"5"}
							fileUrl={fileUrl}
							onFinish={() => {
								linkRef.current.click()
							}}
						>
							{t(`Nx:Download of your document will start in`)}
						</Countdown>
						<div>
							{t(
								"Nx:If it's not started downloading, click the button to download your document "
							)}
							<Button
								href={fileUrl || "#."}
								variant="primary"
								target="_blank"
								className="inline-flex gap-2"
								download
								isExternal={true}
							>
								{t("Nx:Click here")}
							</Button>
						</div>
					</div>
				</LoadingOverlay>

				{/* <a
					href={fileUrl || "#."}
					ref={linkRef}
					target="_blank"
					rel="noreferrer"
					download
					style={{ display: "none" }}
				/> */}
			</div>

			{Error && <div className="text-center">{t("Nx:Something went wrong")} </div>}
		</>
	)
}
export default TenderDownloadWidget
