import React, { useState } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { SelectNative } from "@/ui"
import { useController } from "react-hook-form"

const CategoryFilter = ({ control, categories, name }) => {
	const { t } = useI18n()
	const [category, setCategory] = useState("all")
	const { field } = useController({
		name,
		defaultValue: "all",
		control,
	})

	const categoryNormalizer = (nodes) => {
		return nodes?.map((item) => ({
			value: item?.drupal_internal__tid,
			label: item?.name,
		}))
	}

	const onSelectChange = (option) => {
		setCategory(option.currentTarget.value)
		field.onChange(option.currentTarget.value)
	}

	return (
		<SelectNative
			list={[
				{ value: "all", label: t("-- Choisir une catégories --") },
				...(categoryNormalizer(categories) || []),
			]}
			onChange={onSelectChange}
			id="map-category-filter"
			defaultValue={category}
			label={t("Nx:Catégory")}
			variant="filter"
		/>
	)
}
export default CategoryFilter
