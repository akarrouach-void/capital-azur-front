import { Layer } from "@/ui"
import { useEffect, useState, useRef } from "react"

// Checks if a stored display number is less than a provided value
export const checkDisplayNumber = (display_number) => {
	return (
		!display_number ||
		parseInt(display_number) === 0 ||
		localStorage.getItem("ss_display_number") === null ||
		parseInt(localStorage.getItem("ss_display_number")) < parseInt(display_number)
	)
}

// Increments the stored display number in the local storage, initializing it to 1 if not present
export const incrementDisplayNumber = () => {
	localStorage.getItem("ss_display_number") === null
		? localStorage.setItem("ss_display_number", 1)
		: localStorage.setItem(
				"ss_display_number",
				parseInt(localStorage.getItem("ss_display_number")) + 1
			)
}

export const SplashScreen = ({ children, display_number, duration }) => {
	const [showLayer, setShowLayer] = useState(false)
	const incrementedRef = useRef(false) // Ref to track if increment has happened

	useEffect(() => {
		if (!incrementedRef.current && checkDisplayNumber(display_number)) {
			setShowLayer(true)
			incrementDisplayNumber()
			incrementedRef.current = true // Set the ref to true after incrementing
			if (duration) {
				setTimeout(() => {
					setShowLayer(false)
				}, duration * 1000)
			}
		}
	}, [])

	return (
		<div>
			<Layer
				overlayOpacity="bg-opacity-80"
				modal={true}
				isShow={showLayer}
				onClose={() => setShowLayer(false)}
			>
				{children}
			</Layer>
		</div>
	)
}
