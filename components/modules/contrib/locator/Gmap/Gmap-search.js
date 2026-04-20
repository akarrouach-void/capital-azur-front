import React, { useState, forwardRef, useImperativeHandle, useRef } from "react"
import Fuse from "fuse.js"
import GMapSearchResult from "./Gmap-search-result"
import { Icon } from "@/ui"

const FuzeOptions = {
	shouldSort: true,
	threshold: 0.1, // perfect match.
	// location: 0,
	// distance: 100,
	minMatchCharLength: 3,
	keys: ["name"],
}

const GMapSearch = forwardRef(({ items, markerHandler }, ref) => {
	const [searchResult, setSearchResult] = useState([])
	const [total, setTotal] = useState(0)
	const [currentSearchResult, setCurrentSearchResult] = useState([])
	const [currentPageIndex, setCurrentPageIndex] = useState(1)
	const inputREf = useRef(null)

	const onSearch = (e) => {
		const value = e.target.value
		let suggestions = []

		if (value.length > 0) {
			suggestions = new Fuse(items, FuzeOptions).search(value)
		}
		setSearchResult(suggestions)
		setTotal(suggestions.length)
		suggestions.length > 4
			? setCurrentSearchResult(suggestions.slice(0, 4))
			: setCurrentSearchResult(suggestions)
	}
	const setCurrentPage = (param) => {
		const start = (param - 1) * 4
		setCurrentPageIndex(param)
		setCurrentSearchResult(searchResult.slice(start, start + 4))
	}

	useImperativeHandle(ref, () => ({
		clearInputSearch: () => {
			inputREf.current.value = ""
			setCurrentSearchResult([])
		},
	}))

	return (
		<div className="absolute right-0 top-[224px] z-10 w-full md:right-[110px] md:top-[10px] md:min-h-[40px] md:max-w-[320px]">
			<div className="relative">
				<input
					ref={inputREf}
					type="text"
					placeholder="Search"
					className="h-10 w-full border border-black pr-10"
					onChange={onSearch}
					onFocus={onSearch}
					// onClick={onSearchClick}
				/>
				<button
					onClick={() => {
						inputREf.current.value = ""
						setSearchResult([])
						setTotal(0)
						setCurrentSearchResult([])
						setCurrentPageIndex(1)
					}}
					className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center"
				>
					<Icon id="x" className="h-6 w-6" />
				</button>
			</div>

			{currentSearchResult.length !== 0 ? (
				<GMapSearchResult
					markerHandler={markerHandler}
					items={currentSearchResult}
					setCurrentPage={setCurrentPage}
					total={total}
					currentPageIndex={currentPageIndex}
				/>
			) : (
				<></>
			)}
		</div>
	)
})

export default GMapSearch
