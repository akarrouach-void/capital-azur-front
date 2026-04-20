import { useI18n } from "@vactorynext/core/hooks"

import { Heading, Icon, Link, Text } from "@/ui"
import { useFormatDateToString, vclsx } from "@vactorynext/core/utils"
import { useEffect, useState } from "react"

export const ForumCard = ({
	url,
	title,
	excerpt,
	status,
	views,
	date,
	thematics,
	editeur,
	comments,
}) => {
	const { t } = useI18n()
	const formatDateToString = useFormatDateToString()

	views = views == undefined ? 0 : views

	// To check if we are on Client or Server side
	const [isClient, setIsClient] = useState(false)
	useEffect(() => {
		setIsClient(true)
	}, [])

	return (
		<article className="animate group relative flex h-full flex-col overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
			<div className="mb-6 flex gap-4">
				<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
					<div
						className={vclsx(
							"h-7 w-7 rounded-full border-[3px] shadow-sm transition-transform group-hover:scale-110",
							status === "0"
								? "border-error-200 bg-error-500"
								: "border-success-200 bg-success-500"
						)}
					></div>
				</div>
				<div className="min-w-0 flex-1">
					<Text
						variant="small"
						className="mb-1 font-semibold uppercase tracking-wide text-primary-600"
					>
						{thematics}
					</Text>
					<Heading level={3} variant={5} className="!mb-0">
						{title}
					</Heading>
				</div>
			</div>

			<Text variant="cardExcerpt" className="mb-6">
				{excerpt.length > 128 ? excerpt.substring(0, 280) + "..." : excerpt}
			</Text>

			<div className="mb-4 flex flex-wrap gap-4 text-gray-400">
				<Text variant="small" className="flex items-center gap-1">
					<Icon id="user" width="16px" height="16px" />
					{editeur}
				</Text>
				<Text variant="small" className="flex items-center gap-1">
					<Icon id="clock" width="16px" height="16px" />
					{date}
				</Text>
				<Text variant="small" className="flex items-center gap-1">
					<Icon id="eye" width="16px" height="16px" />
					{`${views} ${t("Nx:views")}`}
				</Text>
				<Text variant="small" className="flex items-center gap-1">
					<Icon id="chat" width="16px" height="16px" />
					{`${comments} ${t("Nx:reponses")}`}
				</Text>
			</div>
			{date && isClient && (
				<Text variant="small" className="text-gray-500">
					{formatDateToString(date)}
				</Text>
			)}
			<Link href={url || "#."} className="absolute inset-0">
				<span className="sr-only">Forum card</span>
			</Link>
		</article>
	)
}
