import React from "react"
import dynamic from "next/dynamic"
import { Heading, Icon, Image, Text } from "@/ui"
import { useRouter } from "next/router"

// Dynamically import both the component AND its CSS
const ImageGallery = dynamic(
	() =>
		import("react-image-gallery").then((mod) => {
			// Import CSS only when component loads
			import("react-image-gallery/styles/css/image-gallery.css")
			return mod
		}),
	{
		ssr: false,
		loading: () => <div>Loading image gallery...</div>,
	}
)

export const config = {
	id: "vactory_default:88",
}

class SliderMediaGallery extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showIndex: false,
			showGalleryFullscreenButton: true,
			showGalleryPlayButton: true,
			showNav: true,
			slideDuration: 450,
			slideOnThumbnailOver: false,
			showVideo: {},
			useWindowKeyDown: false,
			showFullscreenButton: this.props.showFullscreenButton,
			showPlayButton: this.props.showPlayButton,
			showBullets: this.props.showBullets,
			showThumbnails: this.props.showThumbnails,
			isRTL: this.props.isRTL,
			infinite: this.props.isInfinit,
			thumbnailPosition: this.props.position,
			slideInterval: this.props.slideInterval,
		}
	}

	refactoredItems = this.props.items.map((el) => {
		let videoId = el?.video && this._getYoutubeId(el?.video)
		return {
			description: el?.description,
			url: el?.image?.url,
			original: el?.image?.url,
			thumbnail: el?.image?.url,
			alt: el?.image?.alt,
			embedUrl: "https://www.youtube.com/embed/" + videoId,
			renderItem: el?.video && this._renderVideo.bind(this),
		}
	})

	// Get Video ID from Youtube URL
	_getYoutubeId(url) {
		// eslint-disable-next-line no-useless-escape
		let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
		let match = url.match(regExp)

		if (match && match[2].length == 11) {
			return match[2]
		} else {
			return "error"
		}
	}

	_onSlide() {
		this._resetVideo()
	}

	_resetVideo() {
		this.setState({ showVideo: {} })

		if (this.state.showPlayButton) {
			this.setState({ showGalleryPlayButton: true })
		}

		if (this.state.showFullscreenButton) {
			this.setState({ showGalleryFullscreenButton: true })
		}
	}

	_toggleShowVideo(url) {
		this._imageGallery.pause()

		const showVideo = this.state
		this.setState({
			showVideo: {
				...showVideo,
				[url]: !showVideo[url],
			},
		})

		if (!showVideo[url]) {
			if (this.state.showPlayButton) {
				this.setState({ showGalleryPlayButton: false })
			}

			if (this.state.showFullscreenButton) {
				this.setState({ showGalleryFullscreenButton: false })
			}
		}
	}

	_renderVideo(item) {
		return (
			<>
				{this.state.showVideo[item.embedUrl] ? (
					<div>
						<div
							className="close-video"
							onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
							onKeyDown={(e) =>
								e.key === "Enter" && this._toggleShowVideo.bind(this, item.embedUrl)
							}
							role="button"
							tabIndex={0}
						/>
						<iframe
							className="h-[300px] w-full md:h-[600px]"
							src={`${item.embedUrl}?autoplay=1&rel=0`}
							allowFullScreen
							allow="autoplay; encrypted-media"
							title={item.description}
						/>
					</div>
				) : (
					<div
						onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
						onKeyDown={(e) =>
							e.key === "Enter" && this._toggleShowVideo.bind(this, item.embedUrl)
						}
						className="video-wrapper"
						role="button"
						tabIndex={0}
					>
						<div className="animate absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white hover:border-primary-500">
							<Icon
								id="play"
								width="80px"
								height="80px"
								className="animate text-white hover:text-primary-500"
							/>
						</div>
						<Image
							fill
							className="image-gallery-image"
							src={item.original}
							alt={item.alt}
						/>
						{item.description && (
							<span className="image-gallery-description">{item.description}</span>
						)}
					</div>
				)}
			</>
		)
	}

	render() {
		return (
			<div>
				<Heading level={2} className="text-center">
					{this.props.title}
				</Heading>
				<Text className="mb-5 text-center">{this.props.description}</Text>
				<ImageGallery
					ref={(i) => (this._imageGallery = i)}
					items={this.refactoredItems}
					onSlide={this._onSlide.bind(this)}
					infinite={this.state.infinite}
					showBullets={this.state.showBullets}
					showFullscreenButton={
						this.state.showFullscreenButton && this.state.showGalleryFullscreenButton
					}
					showPlayButton={this.state.showPlayButton && this.state.showGalleryPlayButton}
					showThumbnails={this.state.showThumbnails}
					showIndex={this.state.showIndex}
					showNav={this.state.showNav}
					isRTL={this.state.isRTL}
					thumbnailPosition={this.state.thumbnailPosition}
					slideDuration={parseInt(this.state.slideDuration)}
					slideInterval={parseInt(this.state.slideInterval)}
					slideOnThumbnailOver={this.state.slideOnThumbnailOver}
					useWindowKeyDown={this.state.useWindowKeyDown}
				/>
			</div>
		)
	}
}

const SliderMediaGalleryContainer = ({ data }) => {
	const route = useRouter()

	const props = {
		title: data?.extra_field?.title,
		description: data?.extra_field?.description,
		items: data?.components.map((item, i) => ({
			id: i,
			description: item.title,
			image: {
				url: item?.image[0]?._default?._original,
				alt: item?.image[0]?.meta?.alt,
			},
			video: item?.video?.url,
		})),
		showFullscreenButton: data?.extra_field?.showFullscreenButton === 1 ? true : false,
		slideInterval: Number(data?.extra_field?.slideInterval || 2000),
		showPlayButton: data?.extra_field?.showPlayButton === 1 ? true : false,
		showBullets: data?.extra_field?.showBullets === 1 ? true : false,
		showThumbnails: data?.extra_field?.showThumbnails === 1 ? true : false,
		isRTL: route.locale === "ar" ? true : false,
		isInfinit: data?.extra_field?.isInfinit === 1 ? true : false,
		position: data?.extra_field?.position,
	}

	return (
		<SliderMediaGallery
			title={props.title}
			description={props.description}
			items={props.items}
			showFullscreenButton={props.showFullscreenButton}
			slideInterval={props.slideInterval}
			showPlayButton={props.showPlayButton}
			showBullets={props.showBullets}
			showThumbnails={props.showThumbnails}
			isRTL={props.isRTL}
			isInfinit={props.isInfinit}
			position={props.position}
		/>
	)
}

export default SliderMediaGalleryContainer
