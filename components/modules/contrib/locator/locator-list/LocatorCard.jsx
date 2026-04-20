import { Text, Link, Wysiwyg, Icon } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

function generateGoogleMapsLink(placeName, latitude, longitude) {
	const encodedPlaceName = encodeURIComponent(placeName)
	const encodedCoords = `${latitude},${longitude}`
	return `https://www.google.com/maps/search/?api=1&query=${encodedPlaceName}%20${encodedCoords}`
}

const LocatorCard = ({ post }) => {
	const { t } = useI18n()
	return (
		<article className="animate relative flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-primary-200 hover:bg-primary-25 hover:shadow-md">
			<div className="flex items-start justify-between">
				<Text className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-600">
					<a
						href={generateGoogleMapsLink(
							post.name,
							post.field_locator_info.lat,
							post.field_locator_info.lon
						)}
						target="_blank"
					>
						{/* Extend touch target to entire panel */}
						<span className="absolute inset-0" aria-hidden="true" />
						{post.name}
					</a>
				</Text>
			</div>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				{post.field_locator_city?.name && (
					<div className="flex items-start gap-2">
						<Text className="min-w-[60px] text-sm font-medium text-gray-600">
							{t("Nx:Ville")}:
						</Text>
						<Text className="text-sm text-gray-900">{post.field_locator_city.name}</Text>
					</div>
				)}
				{post.field_locator_email && (
					<div className="flex items-start gap-2">
						<Text className="min-w-[60px] text-sm font-medium text-gray-600">
							{t("Nx:Email")}:
						</Text>
						<Text className="break-all text-sm text-gray-900">
							{post.field_locator_email}
						</Text>
					</div>
				)}
				{post.field_locator_phone && (
					<div className="flex items-start gap-2">
						<Text className="min-w-[60px] text-sm font-medium text-gray-600">
							{t("Nx:Tel")}:
						</Text>
						<Text className="text-sm text-gray-900">{post.field_locator_phone}</Text>
					</div>
				)}
				{post.field_locator_fax && (
					<div className="flex items-start gap-2">
						<Text className="min-w-[60px] text-sm font-medium text-gray-600">
							{t("Nx:Fax")}:
						</Text>
						<Text className="text-sm text-gray-900">{post.field_locator_fax}</Text>
					</div>
				)}
				{post.field_locator_autre && (
					<div className="flex items-start gap-2 md:col-span-2">
						<Text className="min-w-[60px] text-sm font-medium text-gray-600">
							{t("Nx:Horaires")}:
						</Text>
						<Text className="text-sm text-gray-900">{post.field_locator_autre}</Text>
					</div>
				)}
				{post.field_locator_description && (
					<div className="flex items-start gap-2 md:col-span-2">
						<Text className="min-w-[60px] text-sm font-medium text-gray-600">
							{t("Nx:Adresse")}:
						</Text>
						<div className="flex-1 text-sm text-gray-900">
							<Wysiwyg className="text-sm" html={post.field_locator_description} />
						</div>
					</div>
				)}
			</div>

			<div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
				<Link
					href={generateGoogleMapsLink(
						post.name,
						post.field_locator_info.lat,
						post.field_locator_info.lon
					)}
					className="group inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
					variant="permalink"
					target="_blank"
				>
					{t("Nx:Voir sur la map")}
					<Icon
						id="arrow-right"
						className="rtl-icon h-4 w-4 transition-transform group-hover:translate-x-1"
						width="16"
						height="16"
					/>
				</Link>
			</div>
		</article>
	)
}

export default LocatorCard
