import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { Wysiwyg } from "@/ui"

export const RawHtml = ({ field }) => {
	const { html, shouldDisplay } = field
	const { watch } = useFormContext()
	const values = watch({ nest: true })
	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

	if (!isVisible) return null
	if (html == undefined || html == null) return
	return <Wysiwyg html={html} />
}
