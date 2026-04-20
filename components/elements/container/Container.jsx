import PropTypes from "prop-types"
import React from "react"

import { vclsx } from "@vactorynext/core/utils"

import { container, containerSpace, containerBg } from "./theme"

const Container = ({
	children,
	layout = "default",
	spacing = "default",
	bgPadding = "none",
	className = "",
	...props
}) => {
	return (
		<div
			className={vclsx(
				container[layout],
				containerSpace[spacing],
				containerBg[bgPadding],
				className
			)}
			{...props}
		>
			{children}
		</div>
	)
}

Container.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	layout: PropTypes.string,
}

export { Container }
