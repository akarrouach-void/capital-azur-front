export const styles = {
	popover: (base) => ({
		...base,
		padding: "20px 30px 20px 20px",
		borderRadius: "10px",
		boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
		border: "1px solid #e5e7eb",
	}),
	badge: (base) => ({
		...base,
		color: "white",
		backgroundColor: "#1553ef",
		fontWeight: "600",
		boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
	}),
	dot: (base) => ({
		...base,
		backgroundColor: "#1553ef",
		transition: "all 0.2s ease-in-out",
		"&:hover": {
			backgroundColor: "#1553ef",
			transform: "scale(1.1)",
		},
	}),
}
export default styles
