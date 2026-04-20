import { useTour } from "@reactour/tour"
import { styles } from "./styles"

export const Badge = ({ children }) => {
	const { showBadge } = useTour()
	const result = Boolean(showBadge)
	if (!result) return null

	const badgeStyles = styles.badge({
		position: "absolute",
		left: "-12px",
		top: "-12px",
		display: "flex",
		height: "24px",
		width: "24px",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "50%",
		border: "1px solid white",
		backgroundColor: "black",
		fontSize: "12px",
		color: "white",
	})

	return <div style={badgeStyles}>{children}</div>
}
