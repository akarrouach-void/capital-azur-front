import { forwardRef } from "react"
import { vclsx } from "@vactorynext/core/utils"
import { Link } from "../link/Link"
import { button } from "./theme"

const CustomButton = ({ children, icon, ...props }) => {
	return (
		<button {...props}>
			{icon}
			{children}
		</button>
	)
}

const Button = forwardRef(
	(
		{
			children,
			type = "button",
			className = "",
			variant = "primary",
			size = "normal",
			pill,
			outline = false,
			disabled = false,
			onClick,
			icon,
			href = null,
			target = null,
			isExternal,
			...props
		},
		ref
	) => {
		let ButtonComponent = CustomButton
		if (href) {
			ButtonComponent = isExternal ? "a" : Link
		}
		return (
			<ButtonComponent
				ref={ref}
				rel={href && target === "_blank" ? "noopener" : null}
				disabled={disabled}
				type={href ? null : type}
				onClick={onClick}
				href={href}
				target={target}
				className={vclsx(
					button.base,
					button.size[size],
					outline ? button.outlineVariant[variant] : button.variant[variant],
					pill && button.pill,
					disabled && button.disabled,
					icon && button.icon,
					className
				)}
				{...props}
			>
				{icon}
				{children}
			</ButtonComponent>
		)
	}
)

export { Button }
