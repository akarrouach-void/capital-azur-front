import React from "react"
import { parse } from "svgson"
import { toast } from "react-toastify"
import copy from "copy-to-clipboard"
import { Icon } from "./Icon"
import IconCode from "!!raw-loader!./Icon"
import { drupal } from "@vactorynext/core/drupal"

const copyToClipboard = (name) => {
	copy(name)
	toast.success(`Copied '${name}' to clipboard`)
}

export const Default = () => {
	const [icons, setIcons] = React.useState([])

	React.useEffect(() => {
		const iconsList = []

		drupal
			.fetch("/icons.svg", { absoluteUrl: true })
			.then((response) => response.text())
			.then((svg) => parse(svg))
			.then((json) => {
				json.children.forEach((element) => {
					iconsList.push(element.attributes.id)
				})
				setIcons(iconsList)
			})
	}, [])

	return (
		<div>
			<ul
				className="col-start-1 row-start-2 grid gap-8 text-center text-xs leading-4"
				style={{
					gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))",
				}}
			>
				{icons.map((iconName) => {
					return (
						<li key={iconName} className="relative flex flex-col-reverse">
							<h3 className="truncate">{iconName}</h3>
							<div className="relative mb-3 h-24">
								<button
									type="button"
									style={{
										cursor: "pointer",
									}}
									onClick={() => copyToClipboard(iconName)}
									className="absolute inset-0 flex w-full cursor-auto items-center justify-center rounded-lg border border-gray-200"
								>
									<Icon id={iconName} width="34" height="34" />
								</button>
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

// eslint-disable-next-line
export default {
	title: "Components/Icon",
	component: Icon,
	parameters: {
		componentSource: {
			code: IconCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
				Description:
				Icon component for displaying SVG icons.
				`,
			},
		},
	},
}
