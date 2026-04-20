// import { Element } from "domhandler/lib/node"
import parse, { domToReact } from "html-react-parser"
import PropTypes from "prop-types"
import { useState } from "react"
import { useMedia } from "@vactorynext/core/hooks"

import { vclsx } from "@vactorynext/core/utils"

import { Heading } from "../heading/Heading"
import { Image } from "../image/Image"
import { Link } from "../link/Link"
import { Text } from "../text/Text"

// Helper function to get image height based on alignment and device
const getImageHeight = (height, dataAlign, isDesktop) => {
	if (!isDesktop) return height

	if (dataAlign === "" || dataAlign === "center") {
		return height
	}

	return height / 2
}

// Helper function to get image max width based on alignment and device
const getImageMaxWidth = (width, dataAlign, isDesktop) => {
	if (!isDesktop) return width

	if (dataAlign === "" || dataAlign === "center") {
		return width
	}

	return width / 2
}

// Helper function to get alignment classes
const getAlignmentClass = (dataAlign) => {
	switch (dataAlign) {
		case "left":
			return "float-left mb-4 mr-4 w-full"
		case "right":
			return "float-right mb-4 ml-4 w-full"
		case "center":
			return "mx-auto block w-full"
		default:
			return ""
	}
}

// ImgComponent extracted from parent component
const WysiwygImage = ({ src, alt, dataAlign }) => {
	const [width, setWidth] = useState("auto")
	const [height, setHeight] = useState("0")
	const isDesktop = useMedia("(min-width: 768px)")

	return (
		<span
			style={{
				display: "block",
				position: "relative",
				height: getImageHeight(height, dataAlign, isDesktop),
				maxWidth: getImageMaxWidth(width, dataAlign, isDesktop),
			}}
			className={vclsx(getAlignmentClass(dataAlign))}
		>
			<Image
				src={`/api/proxy${src}`}
				alt={alt}
				fill
				onLoad={({ target }) => {
					const { naturalWidth, naturalHeight } = target
					setWidth(naturalWidth)
					setHeight(naturalHeight)
				}}
			/>
		</span>
	)
}

// Helper function to handle image nodes
const handleImageNode = (domNode) => {
	const { src, alt = "", "data-align": dataAlign = "" } = domNode.attribs
	return <WysiwygImage src={src} alt={alt} dataAlign={dataAlign} />
}

// Helper function to handle heading nodes
const handleHeadingNode = (domNode) => {
	for (let i = 1; i <= 6; i++) {
		if (domNode.name === `h${i}`) {
			return <Heading level={i}>{domToReact(domNode.children)}</Heading>
		}
	}
	return null
}

// Helper function to handle list nodes
const handleListNode = (domNode) => {
	const className = domNode.attribs.class ? domNode.attribs.class : "custom-list"
	return <ul className={vclsx(className)}>{domToReact(domNode.children)}</ul>
}

// Helper function to handle paragraph nodes
const handleParagraphNode = (domNode, textVariant) => {
	if (typeof domNode?.children === "string") {
		return (
			<Text as="p" variant={textVariant}>
				{domToReact(domNode.children)}
			</Text>
		)
	}
	return null
}

// Helper function to handle link nodes
const handleLinkNode = (domNode) => {
	const { href, class: className, id, rel, target, title } = domNode.attribs
	if (!href.includes("/sites/default/files")) {
		return (
			<Link
				href={href}
				className={className}
				id={id}
				rel={rel}
				target={target}
				title={title}
				aria-label={target === "_blank" ? `${title} (opens in a new tab)` : title}
			>
				{domToReact(domNode.children)}
			</Link>
		)
	}
	return null
}

// Helper function to extract YouTube video ID
const extractYouTubeId = (src) => {
	if (src.includes("youtube.com/watch")) {
		return src.split("%3Fv%3D")[1].split("%26")[0]
	}

	const regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
	const match = src.match(regExp)
	return match ? match[7] : ""
}

// Helper function to handle iframe nodes
const handleIframeNode = (domNode) => {
	const { src } = domNode.attribs
	if (src.includes("media/oembed")) {
		const video_id = extractYouTubeId(src)
		const url = `https://www.youtube.com/embed/${video_id}?enablejsapi=1&rel=0&showinfo=0&controls=1&autoplay=0`

		return (
			<iframe
				className="content-media__object"
				id="featured-video"
				src={url}
				title={video_id}
			></iframe>
		)
	}
	return null
}

export function Wysiwyg({ html, as, prose, className, textVariant, ...rest }) {
	// usecase: Wysiwyg inside of p ==> wrong dom nesting
	const AsComponent = as ?? "div"

	// prose should be optional. e.g, form valadiation messages are not prose
	const finalClassName = vclsx(prose && "prose", className)

	const options = {
		replace: (domNode) => {
			// Handle image nodes
			if (domNode.name === "img") {
				return handleImageNode(domNode)
			}

			// Handle heading nodes
			const headings = ["h1", "h2", "h3", "h4", "h5", "h6"]
			if (headings.includes(domNode.name)) {
				return handleHeadingNode(domNode)
			}

			// Handle list nodes
			if (domNode.name === "ul" || domNode.name === "ol") {
				return handleListNode(domNode)
			}

			// Handle paragraph nodes
			if (domNode.name === "p" && typeof domNode?.children === "string") {
				return handleParagraphNode(domNode, textVariant)
			}

			// Handle link nodes
			if (domNode.name === "a") {
				return handleLinkNode(domNode)
			}

			// Handle iframe nodes
			if (domNode.name === "iframe") {
				return handleIframeNode(domNode)
			}

			// Return null for unhandled nodes (default behavior)
			return null
		},
	}

	return html ? (
		<AsComponent className={finalClassName} {...rest}>
			{parse(html.toString(), options)}
		</AsComponent>
	) : null
}

Wysiwyg.propTypes = {
	prose: PropTypes.bool,
	as: PropTypes.element,
}
