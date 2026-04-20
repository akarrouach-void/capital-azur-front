import React from "react"

import { vclsx } from "@vactorynext/core/utils"

import { Icon } from "../icon/Icon"
import { badge } from "./theme"

export const Badge = ({
	icon,
	text,
	href,
	variant = "default",
	size = "normal",
	className = "",
}) => {
	const Component = href ? "a" : "span"
	return (
		<Component
			href={href}
			className={vclsx(
				badge[variant].wrapper,
				badge[variant].color,
				badge[variant].size[size],
				className
			)}
		>
			{icon && <Icon id={icon} className={vclsx(badge[variant].icon)} />}
			<span className="badge">{text}</span>
		</Component>
	)
}

export default Badge
