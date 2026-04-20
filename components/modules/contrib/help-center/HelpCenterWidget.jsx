import { Link, Image } from "@/ui"
import AutocompleteInput from "./AutocompleteInput"

export const config = {
	id: "vactory_help_center:default",
}

const HelpCenterWidget = ({ data }) => {
	const items = data?.components[0]?.help_center?.data
	const type = data?.components[0]?.help_center?.type
	const search_path = data?.components[0]?.help_center?.search_path

	return (
		<>
			<AutocompleteInput search_path={search_path} />
			<div className="-mx-2 flex w-full flex-wrap">
				{type === "terms" ? (
					items?.map((item, index) => <HelpCenterItem key={index} item={item} />)
				) : type === "nodes" ? (
					<NodeList items={items} />
				) : null}
			</div>
		</>
	)
}

const HelpCenterItem = ({ item }) => (
	<div className="mb-4 w-full px-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
		<div className="flex h-full flex-col items-center justify-between space-y-4 rounded-lg bg-white p-6 text-center shadow-md">
			<div>
				{item?.image?.src && (
					<Image
						src={item?.image?.src}
						alt={item?.image?.meta?.alt}
						{...item?.image?.meta}
					/>
				)}
				<Link
					href={item.url}
					className="block text-2xl font-semibold text-gray-800 transition-colors duration-300 hover:text-blue-600"
				>
					{item.label}
				</Link>
			</div>
			{item.children && (
				<div className="mt-4 w-full">
					<div className="flex flex-col items-start">
						{item.children.map((subitem, subIndex) => (
							<Link
								key={subIndex}
								href={subitem.url}
								className="mb-1 text-sm text-blue-500 hover:underline"
							>
								{subitem.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	</div>
)

const NodeList = ({ items }) => (
	<div className="space-y-4">
		{items?.map((item, index) => (
			<div key={index} className="w-full">
				<div className="rounded-lg bg-white p-4 shadow-md">
					<Link
						href={item.url}
						className="block text-lg font-medium text-blue-600 transition-colors duration-300 hover:text-blue-800"
					>
						{item.label}
					</Link>
				</div>
			</div>
		))}
	</div>
)

export default HelpCenterWidget
