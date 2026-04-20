import React from "react"
import { useI18n } from "@vactorynext/core/hooks"
export const Pagination = (props) => {
	const { total, pageSize, current, onChange } = props
	const count = Math.ceil(total / pageSize)
	const { t } = useI18n()
	return (
		<nav className="flex items-center justify-between border border-primary bg-white">
			<button
				disabled={current - 1 < 1}
				onClick={() => {
					onChange(current - 1)
				}}
				className="inline-flex items-center p-4 text-sm font-medium text-black hover:bg-primary hover:text-white disabled:bg-transparent disabled:text-gray-400"
			>
				{/* <!-- Heroicon name: arrow-narrow-left --> */}
				<svg
					className="h-5 w-5 transform text-primary-400 ltr:mr-3 rtl:ml-3 rtl:-scale-x-100"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
						clipRule="evenodd"
					/>
				</svg>
				{t("Nx:Précédent")}
			</button>

			<button
				disabled={current + 1 > count}
				onClick={() => {
					onChange(current + 1)
				}}
				className="inline-flex items-center p-4 text-sm font-medium text-black hover:bg-primary hover:text-white disabled:bg-transparent disabled:text-gray-400"
			>
				{t("Nx:Suivant")}
				{/* <!-- Heroicon name: arrow-narrow-right --> */}
				<svg
					className="h-5 w-5 transform text-primary-400 ltr:ml-3 rtl:mr-3 rtl:-scale-x-100"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</nav>
	)
}
