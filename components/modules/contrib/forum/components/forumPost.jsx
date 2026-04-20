import { Link } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

export const ForumPost = ({ url, title, status, views, date, editeur }) => {
	const { t } = useI18n()

	return (
		<tr className="border-b border-gray-200 bg-white last:border-0">
			<td className="px-6 py-4 font-medium text-gray-900">
				<Link
					href={url || "#."}
					className="block min-w-[300px] text-base font-medium text-primary lg:min-w-fit lg:max-w-[370px]"
				>
					{title}
				</Link>
			</td>
			<td className="flex items-center whitespace-nowrap px-6 py-4">
				<div
					className={vclsx(
						"h-4 w-4 rounded-full",
						status === "0" ? "bg-error" : "bg-success"
					)}
				></div>
			</td>
			<td className="whitespace-nowrap px-6 py-4">{`${
				typeof Number(views) === "number" ? views : "0"
			} ${t("Nx:views")}`}</td>
			<td className="whitespace-nowrap px-6 py-4">{editeur}</td>
			<td className="whitespace-nowrap px-6 py-4">{date}</td>
		</tr>
	)
}
