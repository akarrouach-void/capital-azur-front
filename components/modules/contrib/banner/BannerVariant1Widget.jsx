import { useNode, useBreakPoint } from "@vactorynext/core/hooks"
import {
	Breadcrumb,
	Container,
	Wysiwyg,
	Image,
	CustomAnimation,
	fadeInRightAnimation,
	Heading,
} from "@/ui"

export const config = {
	id: "vactory_banner:default",
}

// Extract widget config data
const getWidgetConfig = (data) => {
	const component = data?.components?.[0]
	return {
		desktopImage: {
			src: component?.group_banner?.image?.[0]?._default || null,
			width: component?.group_banner?.image?.[0]?.meta?.width || null,
			height: component?.group_banner?.image?.[0]?.meta?.height || null,
			alt: component?.group_banner?.image?.[0]?.meta?.alt || "",
		},
		mobileImage: {
			src: component?.group_banner?.image_mobile?.[0]?._default || null,
			width: component?.group_banner?.image_mobile?.[0]?.meta?.width || null,
			height: component?.group_banner?.image_mobile?.[0]?.meta?.height || null,
			alt: component?.group_banner?.image_mobile?.[0]?.meta?.alt || "",
		},
		usePageTitle: component?.group_banner_title?.use_page_title === 1,
		customTitle: component?.group_banner_title?.custom_title || "",
		useBreadcrumb: component?.group_banner_content?.use_breadcrumb || false,
	}
}

// Extract node banner data
const getNodeBanner = (node) => ({
	desktopImage: {
		src: node?.banner?.image?.thumbnail?.uri?.value?._default || null,
		width: node?.banner?.image?.thumbnail?.meta?.width || null,
		height: node?.banner?.image?.thumbnail?.meta?.height || null,
		alt: node?.banner?.image?.thumbnail?.meta?.alt || "",
	},
	mobileImage: {
		src: node?.banner?.image_mobile?.thumbnail?.uri?.value?._default || null,
		width: node?.banner?.image_mobile?.thumbnail?.meta?.width || null,
		height: node?.banner?.image_mobile?.thumbnail?.meta?.height || null,
		alt: node?.banner?.image_mobile?.thumbnail?.meta?.alt || "",
	},
	title: node?.banner?.title || "",
	description: node?.banner?.description || "",
})

const BannerVariant_1_Widget = ({ data }) => {
	const node = useNode()
	const widgetConfig = getWidgetConfig(data)
	const nodeBanner = getNodeBanner(node)

	// Title Priority: node banner title > page title or custom title from widget
	const title =
		nodeBanner.title ||
		(widgetConfig.usePageTitle ? node.title : widgetConfig.customTitle || node.title)

	// Description Priority: node banner description > node_summary
	const description = nodeBanner.description || node?.blocs?.node_summary || ""

	// Breadcrumb Priority: node setting > widget setting
	const nodeBreadcrumbSetting = node?.blocs?.node_banner_showbreadcrumb
	const showBreadcrumb =
		nodeBreadcrumbSetting !== null && nodeBreadcrumbSetting !== undefined
			? nodeBreadcrumbSetting
			: widgetConfig.useBreadcrumb

	// Breadcrumb items
	const breadcrumb =
		node?.breadcrumb?.map((item, index) => ({
			id: index,
			href: item.url,
			name: item.text,
		})) || []

	// Images Priority: node banner images > widget config images
	const desktopImage = {
		src: nodeBanner.desktopImage.src || widgetConfig.desktopImage.src,
		width: nodeBanner.desktopImage.width || widgetConfig.desktopImage.width,
		height: nodeBanner.desktopImage.height || widgetConfig.desktopImage.height,
	}
	const desktopImageAlt = nodeBanner.desktopImage.alt || widgetConfig.desktopImage.alt

	const mobileImage = {
		src: nodeBanner.mobileImage.src || widgetConfig.mobileImage.src,
		width: nodeBanner.mobileImage.width || widgetConfig.mobileImage.width,
		height: nodeBanner.mobileImage.height || widgetConfig.mobileImage.height,
	}
	const mobileImageAlt = nodeBanner.mobileImage.alt || widgetConfig.mobileImage.alt

	return (
		<Banner
			title={title}
			content={description}
			showBreadcrumb={showBreadcrumb}
			breadcrumb={breadcrumb}
			image_desktop={desktopImage}
			image_desktop_alt={desktopImageAlt}
			image_mobile={mobileImage}
			image_mobile_alt={mobileImageAlt}
		/>
	)
}

const Banner = ({
	image_desktop,
	image_mobile = null,
	image_desktop_alt,
	image_mobile_alt,
	title,
	content,
	showBreadcrumb,
	breadcrumb,
}) => {
	const device = useBreakPoint()
	const hasMobileImage = image_mobile?.src

	// Determine which image to use in a single Image component
	// Default to desktop image when device is undefined (SSR/initial render)
	const shouldUseMobile = device !== "desktop" && hasMobileImage
	const displayImage = shouldUseMobile ? image_mobile : image_desktop
	const displayAlt = shouldUseMobile ? image_mobile_alt : image_desktop_alt

	return (
		<div className="relative flex h-[400px] w-full text-white before:absolute before:left-0 before:top-0 before:z-[1] before:h-full before:w-full before:bg-gray-900/50 before:content-[''] lg:h-[450px]">
			{/* Gradient background - always rendered, fades out when image loads */}
			<div
				className={`animate absolute inset-0 h-full w-full bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 ${
					device !== undefined && displayImage?.src ? "opacity-0" : "opacity-100"
				}`}
			/>

			{/* Image - fades in when device is determined */}
			{displayImage?.src && (
				<Image
					{...displayImage}
					alt={displayAlt}
					className={`animate absolute inset-0 h-full w-full object-cover ${
						device !== undefined ? "opacity-100" : "opacity-0"
					}`}
					loading="eager"
					priority={true}
				/>
			)}
			<Container className="relative z-[1] pt-20 lg:pt-16">
				<CustomAnimation keyFrame={fadeInRightAnimation}>
					{showBreadcrumb && <Breadcrumb pages={breadcrumb} />}
					{title && (
						<Heading level={1} className="mb-6 text-3xl lg:text-6xl">
							{title}
						</Heading>
					)}
					{content && (
						<Wysiwyg html={content} className="inline-block md:max-w-3xl md:text-lg" />
					)}
				</CustomAnimation>
			</Container>
		</div>
	)
}

export default BannerVariant_1_Widget
