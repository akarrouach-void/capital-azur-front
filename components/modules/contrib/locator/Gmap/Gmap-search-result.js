import React, { useState } from "react"
import { Pagination } from "./Gmap-search-pagination"

const GMapSearchResult = ({
	items,
	markerHandler,
	setCurrentPage,
	total,
	currentPageIndex,
}) => {
	const [showResults, setShowResults] = useState(true)
	const ResultItems = items.map((item) => (
		<div
			onClick={(e) => {
				markerHandler(e, item)
				setShowResults(false)
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					markerHandler(e, item)
					setShowResults(false)
				}
			}}
			role="button"
			tabIndex={0}
			className="cursor-pointer px-5 py-3 text-black hover:bg-primary hover:text-white"
			key={item.item.id}
		>
			{item.item.name}
		</div>
	))

	return (
		<>
			{showResults && (
				<>
					<div className="max-h-[450px] max-w-full overflow-y-auto border border-b-0 border-t-0 border-primary bg-white">
						{ResultItems}
					</div>
					{total > 4 && (
						<Pagination
							current={currentPageIndex}
							total={total}
							pageSize={4}
							onChange={setCurrentPage}
							id="gmap-search-pagination"
						/>
					)}
				</>
			)}
		</>
	)
}

export default GMapSearchResult
