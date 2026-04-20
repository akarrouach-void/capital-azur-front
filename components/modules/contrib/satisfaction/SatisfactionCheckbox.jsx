import { Icon, Image, Text } from "@/ui"

const SatisfactionCheckbox = ({ items, selectedValue, onChange }) => {
	return (
		<div className="flex space-x-4">
			{items.map((item, index) => (
				<div key={index} className="flex flex-col items-center">
					<label
						key={index}
						className={`flex cursor-pointer flex-col items-center space-y-2 rounded-full border p-4 transition 
            ${
							selectedValue === item.text
								? "border-blue-500 bg-blue-100 ring-2 ring-blue-500"
								: "border-gray-300"
						}`}
					>
						<input
							type="radio"
							name="custom-radio"
							value={item.text}
							checked={selectedValue === item.text}
							onChange={() => onChange(item.text)}
							className="peer hidden"
						/>
						{item.image ? (
							<Image
								src={item?.image?.src}
								width={item?.image?.width ?? 60}
								height={item?.image?.height ?? 60}
								className="h-16 w-16 rounded-full object-cover"
								alt={item?.text}
							/>
						) : item.icon ? (
							<Icon id={item.icon} className="h-7 w-7" />
						) : null}
					</label>
					{item?.display_text ? <Text>{item?.text}</Text> : ""}
					<Text className="text-sm text-gray-500">{item?.description}</Text>
				</div>
			))}
		</div>
	)
}

export default SatisfactionCheckbox
