import { Button, Link } from "@/ui"
import React from "react"
import { useProject } from "../full/MonProjet"

export const MonProjetReduced = (props) => {
	const { subtitle, action, projectData } = props
	const { userData } = useProject(projectData)
	return (
		<>
			{subtitle && <h3 className="mb-5 text-lg font-light">{subtitle}</h3>}
			<div className="shadow-1 my-5 rounded-lg bg-white p-5">
				<div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:border-b md:border-black/10 md:pb-5 xl:auto-cols-fr xl:grid-flow-col">
					{projectData.map((item, i) => {
						const total_coeff = userData?.[item?.key]?.total_coeff || 0
						return (
							<div key={item.name + i} className="block">
								<progress className="sr-only" max={100} value={total_coeff}>
									{total_coeff}
								</progress>
								<div className="shadow-track bg-trueGray-200 h-3 grow overflow-hidden rounded-full">
									<div
										className="bg-secondary h-full w-0 transition ease-in-out"
										style={{ width: `${total_coeff}%` }}
										role="progressbar"
										aria-valuemin="0"
										aria-valuemax="100"
										aria-valuenow={total_coeff}
									/>
								</div>
								<div className="mt-2 flex justify-between">
									<span className="text-trueGray-700 text-sm uppercase">{item.name}</span>
									<span className="text-sm font-bold">{total_coeff}%</span>
								</div>
							</div>
						)
					})}
				</div>
				<div className="flex justify-center">
					<Button large as={Link} to={action?.url} icon={action?.icon}>
						{action?.title}
					</Button>
				</div>
			</div>
		</>
	)
}
