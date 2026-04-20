import { useAccount, useCollectionContext, useI18n } from "@vactorynext/core/hooks"
import {
	Wysiwyg,
	Text,
	Button,
	LoadingOverlay,
	Image,
	LoginInvite,
	Heading,
	Icon,
} from "@/ui"
import { drupal } from "@vactorynext/core/drupal"
import { formatDate, vclsx } from "@vactorynext/core/utils"
import { useEffect, useState } from "react"

export const config = {
	id: "vactory_sondage:sondage",
}

const SondageWidget = ({ data }) => {
	const context = useCollectionContext(data)
	const result = context?.nodes?.[0]
	const { profile, isAuthenticated, loginUrl, registerUrl } = useAccount()
	const { t } = useI18n()
	const [statistics, setStatistics] = useState(data?.statistics)
	const [voted, setVoted] = useState("")
	const [loading, setLoading] = useState(true)

	const sondage = {
		id: result?.drupal_internal__id,
		description: result?.body?.value,
		question: result?.field_sondage_question,
		options: result?.field_sondage_options,
		results: JSON.parse(result?.field_sondage_results),
		closingDate: result?.field_sondage_close_date,
		status: result?.field_sondage_status == 1 ? t("Nx:Ouvert") : t("Nx:Fermé"),
		isOpen: result?.field_sondage_status == 1 ? true : false,
	}

	const dateOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}

	const vote = async (option) => {
		setLoading(true)
		try {
			const response = await drupal.fetch(`api/sondage/vote/${sondage?.id}/${option}`, {
				method: "POST",
				withAuth: true,
			})
			if (response.ok) {
				results()
			}
		} catch (err) {
			console.error("Sondage: error while voting", err)
		}
	}

	const results = async () => {
		try {
			const response = await drupal.fetch(`api/sondage/statistics/${sondage?.id}`, {
				method: "GET",
				withAuth: true,
			})
			if (response.ok) {
				const result = await response.json()
				setStatistics(result)
				setVoted(true)
				setLoading(false)
			}
		} catch (err) {
			console.error("Sondage: error while getting statistics", err)
		}
	}

	useEffect(() => {
		sondage?.results?.all_votters.includes(profile?.user?.id)
			? setVoted(true)
			: setVoted(false)
		setLoading(false)
	}, [])

	if (!isAuthenticated) {
		return (
			<LoginInvite
				loginUrl={loginUrl}
				registerUrl={registerUrl}
				text={t(
					"Pour participer au sondage, veuillez vous connecter à votre espace privé."
				)}
				showHelpText={true}
			/>
		)
	}

	return (
		<div className="mx-auto w-full max-w-xl">
			<div className="mb-8">
				<Heading level={2} variant={4} className="mb-4 text-center text-gray-700">
					{sondage?.question}
				</Heading>
				{sondage?.description && (
					<Wysiwyg html={sondage.description} className="text-center text-gray-500" />
				)}
			</div>
			<LoadingOverlay active={loading} spinner={true} minHeight={100}>
				{/* If the User hasn't voted */}
				{!voted && voted !== "" && sondage?.isOpen && (
					<>
						<div className="flex flex-wrap justify-evenly gap-4">
							{sondage?.options.map((item, index) => {
								return (
									<Button
										key={index}
										onClick={() => vote(item?.option_value)}
										className={vclsx(
											"group relative h-auto w-[calc(50%-8px)] overflow-hidden shadow-md",
											item?.option_image?.image && "min-h-[180px] md:min-h-[280px]"
										)}
									>
										{item?.option_image?.image ? (
											<Image
												src={item?.option_image?.image}
												alt={item?.option_image?.alt}
												className="animate object-cover group-hover:scale-110"
												fill
											/>
										) : (
											item?.option_text
										)}
									</Button>
								)
							})}
						</div>
					</>
				)}

				{/* If the user has voted before */}
				{((voted && voted != "") || !sondage?.isOpen) && (
					<>
						<div className="mb-6 flex flex-wrap justify-evenly gap-4">
							{statistics?.options?.map((item) => (
								<>
									<div
										className={vclsx(
											"group relative inline-flex w-[calc(50%-8px)] items-center justify-center overflow-hidden rounded-md px-5 py-3 shadow-md",
											item?.type === "image"
												? "min-h-[180px] md:min-h-[280px]"
												: "min-h-11",
											item?.is_current_user_vote ? "bg-success-400" : "bg-gray-200"
										)}
									>
										{item?.type == "image" ? (
											<>
												<Image
													src={item?.image?.media}
													alt={item?.image?.alt}
													fill
													className="object-cover p-2"
												/>
												<Text
													className={vclsx(
														"absolute bottom-0 h-10 w-full py-2 text-center",
														item?.is_current_user_vote ? "bg-success-400" : "bg-gray-200"
													)}
												>
													{item?.percentage} {item?.is_current_user_vote}
												</Text>
											</>
										) : (
											<>{`${item?.text} | ${item?.percentage}`}</>
										)}
									</div>
								</>
							))}
						</div>
						<div className="flex items-center justify-between font-medium">
							<Text
								className={vclsx(
									"flex items-center gap-2",
									sondage.isOpen ? "text-success-500" : "text-error-500"
								)}
							>
								<Icon
									id={sondage.isOpen ? "check-circle-solid" : "lock"}
									width={20}
									height={20}
								/>
								{sondage?.status}
							</Text>
							<Text>
								{statistics?.votes_count} {t("Nx:votes")}
							</Text>
						</div>
					</>
				)}
			</LoadingOverlay>

			<Text variant="small" className="mt-6 text-gray-400">
				{`${t("Nx:Ce sondage sera automatiquement fermé le")} ${formatDate(
					sondage?.closingDate,
					dateOptions
				)}`}
			</Text>
		</div>
	)
}

export default SondageWidget
