import get from "lodash.get"
import { useNode } from "@vactorynext/core/hooks"
import {
	Breadcrumb,
	Container,
	Wysiwyg,
	CustomAnimation,
	fadeInRightAnimation,
	Image,
} from "@/ui"
import { useEffect, useRef } from "react"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_banner:video",
}

const BannerVideoWidget = ({ data }) => {
	const node = useNode()
	const settingsGlobal = {
		title:
			get(data, "components.0.group_banner_title.use_page_title", 0) == 1
				? node.title
				: get(data, "components.0.group_banner_title.custom_title", node.title),
	}

	// from page banner
	const settings = {
		showBreadcrumb: get(data, "components.0.group_banner_content.use_breadcrumb", false),
		content: (
			<Wysiwyg
				html={get(
					data,
					"components.0.group_banner_content.description.value['#text']",
					null
				)}
			/>
		),
		breadcrumb: node?.breadcrumb.map((item, index) => ({
			id: index,
			href: item.url,
			name: item.text,
		})),

		title: node?.banner?.title || settingsGlobal.title,
		video: get(data, "components.0.group_banner.video", null),
		image: get(data, "components.0.group_banner.image", null),
		showImage: get(data, "components.0.group_banner.show_image", 0),
	}

	return <Banner {...settings} />
}

const banner = {
	default: {
		wrapper:
			"relative w-full text-white h-[240px] lg:h-[390px] pb-6 lg:pb-[90px] flex items-end justify-start before:content-[''] before:bg-gray-900/50 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:z-[1]",
		image_mobile: "absolute top-0 left-0 w-full h-full object-cover",
		video: "absolute left-0 top-0 h-full w-full object-cover",
		title:
			"text-white text-xl leading-[30px] lg:text-5xl lg:leading-normal font-semibold -tracking-[1px]",
		content: "",
		breadcrumb: {
			wrapper: "mt-5",
			variant: "default",
		},
	},
}

const Banner = ({
	title,
	content,
	showBreadcrumb,
	breadcrumb,
	video,
	image,
	showImage,
	variant = "default",
}) => {
	const videoRef = useRef(null)

	useEffect(() => {
		const videoElement = videoRef.current
		if (videoElement) {
			videoElement.muted = true // Ensure the video is muted
			videoElement.play() // Attempt to play the video
		}
	}, [])

	return (
		<div className={banner[variant].wrapper}>
			<video
				className={vclsx(
					banner[variant].video,
					showImage && image[0]?._default ? "hidden lg:block" : ""
				)}
				ref={videoRef}
				muted
				autoPlay
				loop
				playsInline
				preload="metadata"
			>
				<source src={video} type="video/webm" />
			</video>

			{showImage && image[0]?._default ? (
				<div className="lg:hidden">
					<Image
						src={image[0]?._default}
						alt={image[0]?.meta?.alt}
						width={image[0]?.meta?.width}
						height={image[0]?.meta?.height}
						className={banner[variant].image_mobile}
					/>
				</div>
			) : null}

			<Container className="relative z-[1]">
				<CustomAnimation keyFrame={fadeInRightAnimation}>
					<div className={banner?.[variant]?.title_wrapper || ""}>
						{title && <h1 className={banner?.[variant]?.title}>{title}</h1>}
						{content && <div className={banner?.[variant]?.content || ""}>{content}</div>}
					</div>
					{showBreadcrumb && (
						<div className={banner?.[variant]?.breadcrumb?.wrapper || ""}>
							<Breadcrumb
								variant={banner?.[variant]?.variant || "default"}
								pages={breadcrumb}
							/>
						</div>
					)}
				</CustomAnimation>
			</Container>
		</div>
	)
}

export default BannerVideoWidget
