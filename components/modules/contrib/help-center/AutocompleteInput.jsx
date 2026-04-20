import { useState, useEffect, useRef } from "react"
import { drupal } from "@vactorynext/core/drupal"
import { useRouter } from "next/router"
import { Link } from "@/ui"

const AutocompleteInput = ({ search_path }) => {
	const [input, setInput] = useState("")
	const [results, setResults] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [showResults, setShowResults] = useState(false)
	const inputRef = useRef(null)
	const router = useRouter()
	const locale = router.locale

	useEffect(() => {
		fetchResult(input)
	}, [input])

	const fetchResult = async (input) => {
		if (input.length < 2) {
			setResults([])
			setShowResults(false)
			return
		}
		setIsLoading(true)
		try {
			const controller = new AbortController()
			const response = await drupal.fetch(
				`${locale}/api/help-center-search?keyword=${input}`,
				{
					signal: controller.signal,
				}
			)
			const res = await response.json()
			const data = response.status !== 200 ? [] : res
			setResults(data)
		} catch (err) {
			setResults([])
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (e) => {
		setInput(e.target.value)
		setShowResults(true)
	}

	const handleClickOutside = (e) => {
		if (inputRef.current && !inputRef.current.contains(e.target)) {
			setShowResults(false)
		}
	}

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault()
			if (results.length > 0) {
				router.push(`${search_path}?help-center-keyword=${e.target.value}`)
			}
		}
	}

	useEffect(() => {
		document.addEventListener("click", handleClickOutside)
		return () => {
			document.removeEventListener("click", handleClickOutside)
		}
	}, [])

	return (
		<div className="relative w-full max-w-md" ref={inputRef}>
			<div className="relative">
				<input
					type="text"
					value={input}
					onChange={handleInputChange}
					onKeyDown={handleKeyPress}
					placeholder="Rechercher..."
					className="w-full rounded-lg border bg-white px-4 py-2 pl-10 pr-10 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
				/>
				{isLoading && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
						<div className="h-6 w-6 animate-spin cursor-wait rounded-full border-b-2 border-l-2 border-primary"></div>
					</div>
				)}
			</div>
			{showResults && results.length > 0 && (
				<div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
					{results.map((result, index) => (
						<div key={index} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
							<Link href={result.alias}>
								<p className="text-sm font-medium text-gray-700">{result.title}</p>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default AutocompleteInput
