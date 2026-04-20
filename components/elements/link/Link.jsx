import { forwardRef, useMemo, useState, useEffect } from "react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { link } from "./theme"
import {
	vclsx,
	resolveNofollow,
	buildLinkRel,
	handleLinkClick,
} from "@vactorynext/core/utils"
import { useFlag } from "@vactory/console/client"

const Link = forwardRef(
	(
		{
			href = "#.",
			children,
			className = "",
			variant = "default",
			onClick = null,
			target = "_self",
			...rest
		},
		ref
	) => {
		const defaultLocale = useFlag("language")
		const enableNofollow = useFlag("enableNofollow") ?? false
		const nofollowWhitelist = useFlag("nofollowWhitelist") ?? ""
		const router = useRouter()
		const [isClient, setIsClient] = useState(false)

		// Only calculate on client side to avoid hydration mismatches
		useEffect(() => {
			setIsClient(true)
		}, [])

		// Determine if nofollow should be added
		const addNofollow = useMemo(() => {
			return resolveNofollow({
				href,
				enabled: enableNofollow,
				whitelist: nofollowWhitelist,
				isClient,
			})
		}, [href, enableNofollow, nofollowWhitelist, isClient])

		const relAttributes = buildLinkRel({
			target,
			addNofollow,
			existingRel: rest.rel,
		})

		const handleClick = (e) => {
			handleLinkClick({ event: e, href, defaultLocale, router, onClick })
		}

		// Remove rel from rest to avoid conflicts
		// eslint-disable-next-line no-unused-vars
		const { rel, ...restWithoutRel } = rest

		return (
			<NextLink
				href={href}
				ref={ref}
				rel={relAttributes}
				target={target}
				className={vclsx(className, link[variant])}
				onClick={handleClick}
				{...restWithoutRel}
			>
				{children}
			</NextLink>
		)
	}
)

export { Link }
