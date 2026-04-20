import PropTypes from "prop-types"
import React from "react"

import { vclsx } from "@vactorynext/core/utils"

import { heading } from "./theme"

const Heading = ({ children, className = "", level = 2, variant = null, ...props }) => {
	// const levels = [1, 2, 3, 4, 5, 6]
	const Component = level ? `h${level}` : "h2"

	return (
		<Component
			className={vclsx(
				variant === null && heading[level],
				variant && heading[variant],
				className
			)}
			{...props}
		>
			{children}
		</Component>
	)
}

Heading.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	//ariant: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
}

export { Heading }

/**
 * fs lh ls fw fm ......
 */
