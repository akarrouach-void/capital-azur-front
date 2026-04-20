import { Image, Text } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

export const SessionExpiration = () => {
	const { t } = useI18n()
	return (
		<div className="relative h-screen w-full bg-neutral-400">
			<div className="absolute left-1/2 top-1/2 flex min-h-[200px] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-white p-5 md:p-10">
				<Image
					alt="spinner"
					src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGRkZGIiAvPjxnPjxjaXJjbGUgY3g9IjE2IiBjeT0iNjQiIHI9IjE2IiBmaWxsPSIjNzE3MTcxIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSI2NCIgcj0iMTQuMzQ0IiBmaWxsPSIjNzE3MTcxIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSA2NCA2NCkiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjY0IiByPSIxMi41MzEiIGZpbGw9IiM3MTcxNzEiIHRyYW5zZm9ybT0icm90YXRlKDkwIDY0IDY0KSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iNjQiIHI9IjEwLjc1IiBmaWxsPSIjNzE3MTcxIiB0cmFuc2Zvcm09InJvdGF0ZSgxMzUgNjQgNjQpIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSI2NCIgcj0iMTAuMDYzIiBmaWxsPSIjNzE3MTcxIiB0cmFuc2Zvcm09InJvdGF0ZSgxODAgNjQgNjQpIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSI2NCIgcj0iOC4wNjMiIGZpbGw9IiM3MTcxNzEiIHRyYW5zZm9ybT0icm90YXRlKDIyNSA2NCA2NCkiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjY0IiByPSI2LjQzOCIgZmlsbD0iIzcxNzE3MSIgdHJhbnNmb3JtPSJyb3RhdGUoMjcwIDY0IDY0KSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iNjQiIHI9IjUuMzc1IiBmaWxsPSIjNzE3MTcxIiB0cmFuc2Zvcm09InJvdGF0ZSgzMTUgNjQgNjQpIi8+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIHZhbHVlcz0iMCA2NCA2NDszMTUgNjQgNjQ7MjcwIDY0IDY0OzIyNSA2NCA2NDsxODAgNjQgNjQ7MTM1IDY0IDY0OzkwIDY0IDY0OzQ1IDY0IDY0IiBjYWxjTW9kZT0iZGlzY3JldGUiIGR1cj0iNjQwbXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9nPjwvc3ZnPg=="
					width={64}
					height={64}
					className="mb-5"
				/>
				<Text className="text-center">{t("Nx:Votre session vient d'être expirée.")}</Text>
				<Text className="text-center">{t("Vous êtes actuellement déconnecté.")}</Text>
			</div>
		</div>
	)
}
