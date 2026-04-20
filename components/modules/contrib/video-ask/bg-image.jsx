export const BgImage = ({ bgImage, children, className = "" }) => {
	return (
		<div
			style={{ backgroundImage: `url(${bgImage})` }}
			className={`bg-cover ${className}`}
		>
			{children}
		</div>
	)
}
