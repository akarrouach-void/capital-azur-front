import PropTypes from "prop-types"
import React from "react"

import { vclsx } from "@vactorynext/core/utils"

import { text } from "./theme"

const Text = ({ variant = "base", as = "p", className = "", children, ...props }) => {
	const Component = as

	return (
		<Component className={vclsx(variant in text && text[variant], className)} {...props}>
			{children}
		</Component>
	)
}

Text.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	as: PropTypes.string,
	color: PropTypes.string,
}

export { Text }
