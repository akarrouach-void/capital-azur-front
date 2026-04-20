import { vclsx } from "@vactorynext/core/utils"

import { Container } from "./containers/Container"
import { Details } from "./containers/Details"
import { FieldSet } from "./containers/FieldSet"
import { FlexBox } from "./containers/FlexBox"
import { Section } from "./containers/Section"
import { RenderField } from "./Form"

// md:max-w-1/12 md:max-w-2/12 md:max-w-3/12 md:max-w-4/12 md:max-w-5/12 md:max-w-6/12 md:max-w-7/12 md:max-w-8/12 md:max-w-9/12 md:max-w-10/12 md:max-w-11/12 md:max-w-12/12
// md:basis-1/12 md:basis-2/12 md:basis-3/12 md:basis-4/12 md:basis-5/12 md:basis-6/12 md:basis-7/12 md:basis-8/12 md:basis-9/12 md:basis-10/12 md:basis-11/12 md:basis-12/12

export const FormLayout = ({ data, classes = "" }) => {
	const LAYOUTS = [
		"webform_flexbox",
		"webform_section",
		"container",
		"fieldset",
		"details",
	]

	const keys = Object.keys(data?.childs || [])
	if (keys.length == 0) return null

	let Wrapper = Container
	data["classes"] =
		data?.class !== undefined && data?.class !== ""
			? `${data.class}${classes !== "" ? ` ${classes}` : ""}`
			: classes
	switch (data?.type) {
		case "webform_flexbox":
			Wrapper = FlexBox
			break
		case "webform_section":
			Wrapper = Section
			break
		case "container":
			Wrapper = Container
			break
		case "fieldset":
			Wrapper = FieldSet
			break
		case "details":
			Wrapper = Details
			break
	}

	if (data?.type == "webform_flexbox") {
		return (
			<Wrapper {...data}>
				{keys.map((item, index) => {
					if (item == "flexTotal") {
						return
					}
					const flexSize =
						data.childs[item]["flex"] == undefined ? "12" : data.childs[item]["flex"]
					const itemMaxWidth = `md:max-w-${flexSize}/12`
					const itemFlexBasis = `md:basis-${flexSize}/12`

					if (LAYOUTS.includes(data?.childs[item]["type"])) {
						return <FormLayout key={index} data={data?.childs[item]} />
					}
					return (
						<div
							key={`${item}-wrapper`}
							className={vclsx("w-full shrink-0 grow px-2", itemFlexBasis, itemMaxWidth)}
						>
							<RenderField key={`${item}-container`} field={[item, data?.childs[item]]} />
						</div>
					)
				})}
			</Wrapper>
		)
	}

	return (
		<Wrapper {...data}>
			{keys.map((item, index) => {
				if (item == "flexTotal") {
					return
				}
				if (LAYOUTS.includes(data?.childs[item]["type"])) {
					return <FormLayout key={index} data={data?.childs[item]} />
				}
				return (
					<RenderField key={`${item}-container`} field={[item, data?.childs[item]]} />
				)
			})}
		</Wrapper>
	)
}
