import React, { Children, useEffect, useState } from "react"
import { toggleGroup } from "./theme"
import { vclsx } from "@vactorynext/core/utils"

export const ToggleGroup = ({
	children,
	type = "multiple",
	onChange = () => {},
	disabled = false,
	variant = "default",
}) => {
	const [toggleState, setToggleState] = useState([])

	const handleClick = (child) => {
		if (type === "multiple") {
			if (toggleState.includes(child?.key)) {
				setToggleState((prev) => prev.filter((key) => key !== child?.key))
			} else {
				setToggleState((prev) => prev.concat(child?.key))
			}
		} else if (type === "single") {
			if (toggleState.includes(child?.key)) {
				setToggleState(() => [])
			} else {
				setToggleState(() => [child?.key])
			}
		}
	}

	useEffect(() => {
		onChange(toggleState)
	}, [toggleState])

	const getElementClass = (child) => {
		if (toggleState.includes(child?.key)) {
			return toggleGroup[variant].element.active
		} else {
			return toggleGroup[variant].element.inactive
		}
	}

	const getDisabledClass = () => {
		return toggleGroup[variant].element.disabled
	}

	return (
		<div
			className={vclsx(
				toggleGroup[variant].wrapper.base,
				disabled && toggleGroup[variant].wrapper.disabled
			)}
		>
			{Children.map(children, (child, index) => {
				// Use the child's existing key/id if available, otherwise fall back to index-based key
				const stableKey = child.key || child.id || `toggle-item-${index}`
				return (
					<button
						key={stableKey}
						onClick={() => handleClick(child)}
						disabled={disabled}
						className={vclsx(
							toggleGroup[variant].element.base,
							disabled ? getDisabledClass() : getElementClass(child)
						)}
					>
						{child}
					</button>
				)
			})}
		</div>
	)
}

export default ToggleGroup
