import React, { useState } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { SelectNative } from "@/ui"

const GMapSearchCategory = ({ filterByCategory, categories }) => {
	const { t } = useI18n()
	const [category, setCategory] = useState("all")

	const categoryNormalizer = (nodes) => {
		return nodes?.map((item) => ({
			value: item?.uuid,
			label: item?.name,
		}))
	}

	const onSelectChange = (categoryId) => {
		setCategory(categoryId)
		filterByCategory(categoryId)
	}

	return (
		<div className="md:absolute md:left-[10px] md:top-[10px] md:z-10 md:max-w-[320px]">
			<SelectNative
				list={[
					{ value: "all", label: t("tout les catégory") },
					...(categoryNormalizer(categories) || []),
				]}
				onChange={(e) => onSelectChange(e.currentTarget.value)}
				id="map-category-filter"
				defaultValue={category}
				label={t("Nx:Catégory")}
				variant="filter"
			/>
		</div>
	)
}

export default GMapSearchCategory
