import { default as NextImage } from "next/image"
import blurredPlaceholderImage from "../../../public/assets/img/blurred-placeholder-image.png"
import { useTheme } from "next-themes"
import { useUserPreference, useNode } from "@vactorynext/core/hooks"
import { useState } from "react"
import { vclsx, createHandleDoubleClick } from "@vactorynext/core/utils"
import { useRouter } from "next/router"

// Helper function to determine theme
const getChosenTheme = (theme, systemTheme, customTheme) => {
	if (theme) {
		return theme === "system" ? systemTheme : theme
	}
	return customTheme
}

// Helper function to get image source
const getImageSrc = (src, styleMode, chosenTheme) => {
	if (typeof src === "string") {
		return src
	}

	if (styleMode) {
		return src[styleMode]
	}

	if (chosenTheme === "dark") {
		return src["dark"]
	}

	return src["_original"]
}

// Helper function to extract live mode
const extractLiveMode = (imageSrc) => {
	const regex = /{LiveMode\s*id="([^"]*)"}([\s\S]*){\/LiveMode}/i
	const match = imageSrc?.match(regex)

	if (match) {
		return {
			liveMode: match[1],
			processedSrc: match[2],
		}
	}

	return {
		liveMode: null,
		processedSrc: imageSrc,
	}
}

// Component for rendering image content
const ImageContent = ({
	finalImageSrc,
	alt,
	className,
	quality,
	blurredPlaceholderImage,
	disablePlaceholder,
	imageSizes,
	...rest
}) => {
	return (
		<NextImage
			src={finalImageSrc}
			alt={alt}
			quality={quality}
			className={className}
			blurDataURL={blurredPlaceholderImage.src}
			placeholder={disablePlaceholder ? "empty" : "blur"}
			sizes={imageSizes}
			{...rest}
		/>
	)
}

export const Image = ({
	src,
	alt,
	quality = 80,
	className = null,
	disablePlaceholder = false,
	styleMode = null,
	type = null,
	sizes = "100vw",
	imageContainerClassName = "h-full",
	...rest
}) => {
	const { theme, systemTheme } = useTheme()
	const [imageSrcUpdated, setImageSrcUpdated] = useState(null)
	const { theme: customTheme } = useUserPreference()
	const router = useRouter()
	const node = useNode()

	// Early return for missing src
	if (!src) {
		return (
			<div className="mx-auto w-full max-w-5xl rounded-xl border-2 border-red-500 bg-red-100 p-6">
				<p className="mb-4 text-xl font-medium text-red-700">
					Image.jsx : Missing `src` prop or empty
				</p>
			</div>
		)
	}

	const locale = router.locale

	// Use helper functions to reduce complexity
	const chosenTheme = getChosenTheme(theme, systemTheme, customTheme)
	const initialImageSrc = getImageSrc(src, styleMode, chosenTheme)
	const { liveMode, processedSrc } = extractLiveMode(initialImageSrc)

	// Create handleDoubleClick function with proper parameters
	const handleDoubleClick = createHandleDoubleClick(
		liveMode,
		setImageSrcUpdated,
		node,
		locale
	)

	const finalImageSrc = imageSrcUpdated || processedSrc
	const cardSizes =
		"(max-width: 768px) 100vw, (max-width: 1024px) 50vw, calc((1300px / 3))"
	const imageSizes = type === "card" ? cardSizes : sizes

	const imageProps = {
		finalImageSrc,
		alt,
		className,
		quality,
		blurredPlaceholderImage,
		disablePlaceholder,
		imageSizes,
		...rest,
	}

	if (liveMode) {
		return (
			<button
				type="button"
				onDoubleClick={handleDoubleClick}
				className={vclsx(
					"border-2 border-dashed border-red-500",
					imageContainerClassName
				)}
			>
				<ImageContent {...imageProps} />
			</button>
		)
	}

	return (
		<div className={imageContainerClassName}>
			<ImageContent {...imageProps} />
		</div>
	)
}
