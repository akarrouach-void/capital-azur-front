import { useRouter } from "next/router"
import { Icon, Link, Heading } from "@/ui"
import { useI18n, useNode } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_dynamic_field_decoupled:share-links",
}

const ShareLinkContainer = ({ data }) => {
	const props = {
		title: data?.components?.[0]?.title || null,
		facebook: data?.components?.[0]?.facebook || false,
		twitter: data?.components?.[0]?.twitter || false,
		linkedin: data?.components?.[0]?.linkedin || false,
		whatsapp: data?.components?.[0]?.whatsapp || false,
		mail: data?.components?.[0]?.mail || false,
		pinterest: data?.components?.[0]?.pinterest || false,
	}

	return <ShareBlock {...props} />
}

const ShareBlock = ({
	title,
	facebook,
	twitter,
	linkedin,
	whatsapp,
	mail,
	pinterest,
}) => {
	const { t } = useI18n()

	return (
		<div role="toolbar" aria-label={t("Nx:Partager cet article")} className="sharelinks">
			{title && (
				<Heading level="3" variant="noStyle" className="sharelinks__title">
					{title}
				</Heading>
			)}
			<nav className="sharelinks__items">
				{facebook && <Share platform="facebook" icon="facebook" />}
				{twitter && <Share platform="twitter" icon="twitter" />}
				{linkedin && <Share platform="linkedin" icon="linkedin" />}
				{whatsapp && <Share isPopUp={false} platform="whatsapp" icon="chat" />}
				{mail && <Share isPopUp={false} platform="mail" icon="mail-solid" />}
				{pinterest && <Share platform="pinterest" icon="link-solid" />}
			</nav>
		</div>
	)
}

export const Share = ({
	link = null,
	platform,
	isPopUp = true,
	icon = null,
	message,
	...props
}) => {
	const node = useNode()
	const domain = node._NEXT_PUBLIC_ENV.NEXT_BASE_URL
	const router = useRouter()
	const _link = link ? link : `${domain}/${router.locale}${router.asPath}`
	const _icon = icon ? icon : platform

	const handleClick = (e) => {
		if (isPopUp) {
			e.preventDefault()
			window.open(
				shareLinks[platform](_link, (message = "")),
				"Partage links",
				"width=800, height=800"
			)
		}
	}

	return (
		<Link
			href={shareLinks[platform](_link, (message = ""))}
			onClick={(e) => handleClick(e)}
			target="_blank"
			rel="noreferrer noopener nofollow"
			aria-label={`Share on ${platform}`}
			title={`Share on ${platform} ${message}`}
			name={platform}
			className="sharelinks__link"
			variant="noStyle"
			{...props}
		>
			<Icon id={_icon} width={16} height={16} />
		</Link>
	)
}

const shareLinks = {
	twitter: (link, message) =>
		`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
			message || ""
		)}&url=${encodeURIComponent(link || "")}`,
	pinterest: (link, message) =>
		`http://pinterest.com/pin/create/button/?url=${encodeURIComponent(
			message || ""
		)}&url=${encodeURIComponent(link || "")}`,
	whatsapp: (link, message) =>
		`whatsapp://send?text=${encodeURIComponent(message || "")}&url=${encodeURIComponent(
			link || ""
		)}`,
	facebook: (link) =>
		`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(link || "")}`,
	mail: (link, message) =>
		`mailto:?subject=${encodeURIComponent(message || "")}&body=${encodeURIComponent(
			link || ""
		)}`,
	linkedin: (link) =>
		`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
			link || ""
		)}`,
	telegram: (link, message) =>
		`https://t.me/share/url?url=${encodeURIComponent(
			link || ""
		)}&text=${encodeURIComponent(message || "")}`,
}

export default ShareLinkContainer
