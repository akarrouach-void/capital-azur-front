import { Button } from "@/ui"

export const ExtraButton = ({ goto, label, setScreen, id }) => {
	return (
		<div className="py-4 text-center">
			<Button onClick={() => setScreen(goto, { [id]: goto })}>{label}</Button>
		</div>
	)
}
