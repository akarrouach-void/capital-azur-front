import { Input } from "./Input"
import { Button } from "@/ui"
import { useRef } from "react"

export const InputButton = ({
	buttonContent,
	onChange,
	handleButtonClick,
	buttonClasses,
	...props
}) => {
	const inputRef = useRef()
	const _handleButtonClick = () => {
		handleButtonClick?.(inputRef.current.value)
	}
	return (
		<Input
			ref={inputRef}
			onChange={onChange}
			addonAfter={
				<Button
					variant={props.variant === "rounded" ? "roundedAddonAfter" : "primary"}
					onClick={_handleButtonClick}
					className={buttonClasses}
				>
					{buttonContent}
				</Button>
			}
			{...props}
		/>
	)
}

export default InputButton
