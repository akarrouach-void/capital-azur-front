import { Wysiwyg } from "@/ui"

export const config = {
	id: "vactory_default:29",
	lazy: false,
}

const freeContent = (data) => {
	const cols = data.data.extra_field.col

	const gridColsMap = {
		2: "md:grid-cols-2",
		3: "md:grid-cols-3",
	}

	const gapMap = {
		2: "md:gap-10",
		3: "md:gap-8",
	}

	const gridColsClass = gridColsMap[cols] || "md:grid-cols-1"
	const gapClass = gapMap[cols] || "md:gap-4"

	return (
		<div className={`grid ${gridColsClass} ${gapClass}`}>
			{data.data.components.map((item, i) => {
				{
					return (
						item.description && (
							<Wysiwyg key={i} className="mb-6" html={item.description.value["#text"]} />
						)
					)
				}
			})}
		</div>
	)
}

export default freeContent
