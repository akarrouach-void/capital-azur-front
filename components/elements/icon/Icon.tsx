import React from "react"
import { IconId } from "./icon-types"

type IconProps = Omit<React.SVGProps<SVGSVGElement>, "id"> & {
	id: IconId
	width?: number
	height?: number
}

export const Icon = ({ id, width = 24, height = 24, ...props }: IconProps) => (
	<svg {...props} width={width} height={height}>
		<use className="fill-current" href={`/icons.svg#${id}`} />
	</svg>
)
