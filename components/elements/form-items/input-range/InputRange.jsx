import { range } from "./theme"

export const InputRange = ({ label, max, min, thumb, handleInputChange, name }) => {
	return (
		<div className={range.container}>
			{label && (
				<label htmlFor={name} className={range.label}>
					{label}
				</label>
			)}
			<div className={range.wrapper}>
				<span className={range.intervalIndicator}>{min}</span>
				<input
					onChange={(e) => {
						handleInputChange?.(e.target.value)
					}}
					type="range"
					className={range.input[thumb]}
					min={min}
					max={max}
					id={name}
					name={name}
				/>
				<span className={range.intervalIndicator}>{max}</span>
			</div>
		</div>
	)
}
