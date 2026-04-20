import { vclsx } from "@vactorynext/core/utils"
import { dotsloader, spinner, pulse } from "./theme"

export const LoadingOverlay = ({
	children,
	active = false,
	minHeight = 200,
	background = "rgba(0, 0, 0, 0.1)",
	spinner: useSpinner,
	loader: useLoader,
	pulse: usePulse,
	fadeSpeed = 500,
	...rest
}) => {
	return (
		<div
			style={{
				position: "relative",
				minHeight: minHeight,
			}}
		>
			{children}
			{active && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: background,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 800,
						animation: `fadeIn ${fadeSpeed}ms ease-in`,
					}}
				>
					{useSpinner && <Spinner {...rest} />}
					{useLoader && <DotsLoader {...rest} />}
					{usePulse && <Pulse {...rest} />}
				</div>
			)}
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
			`}</style>
		</div>
	)
}

const Spinner = ({ variant = "default" }) => {
	return (
		<div className={vclsx(spinner[variant].wrapper)}>
			<div className={spinner[variant].loader}></div>
		</div>
	)
}

const DotsLoader = ({ variant = "default" }) => {
	return (
		<div className={vclsx(dotsloader[variant].wrapper)}>
			<div
				className={`${dotsloader[variant].dots} ${dotsloader[variant].animation.firstDot}`}
			></div>
			<div
				className={`${dotsloader[variant].dots} ${dotsloader[variant].animation.secondeDot}`}
			></div>
			<div
				className={`${dotsloader[variant].dots} ${dotsloader[variant].animation.thirdDot}`}
			></div>
		</div>
	)
}

const Pulse = ({ variant = "default" }) => {
	return (
		<div className={vclsx(pulse[variant].wrapper)}>
			<div className={pulse[variant].profileImage}></div>
			<div className={pulse[variant].container.wrapper}>
				<div className={pulse[variant].container.title}></div>
				<div className={pulse[variant].container.paragraph.wrapper}>
					<div className={pulse[variant].container.paragraph.line1.wrapper}>
						<div className={pulse[variant].container.paragraph.line1.grid1}></div>
						<div className={pulse[variant].container.paragraph.line1.grid2}></div>
					</div>
					<div className={pulse[variant].container.paragraph.line2}></div>
				</div>
			</div>
		</div>
	)
}
