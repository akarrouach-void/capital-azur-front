import { Icon } from "@/ui"
import { useTour } from "@reactour/tour"

export const Close = ({ onClick }) => {
	const { showCloseButton } = useTour()
	const result = Boolean(showCloseButton)
	if (!result) return null
	return (
		<button onClick={onClick} className="absolute right-3 top-3">
			<Icon id="x" className="h-2.5 w-2.5" aria-label="close-tour" />
		</button>
	)
}
