import { useState, useRef, useEffect } from "react"
import { Icon, Link } from "@/ui"
import { useRouter } from "next/router"
import { useNode } from "@vactorynext/core/hooks"
import { getEnabledLanguages } from "@vactorynext/core/lib"

const languages = getEnabledLanguages({ withLabels: true })

export const LangSwitch = () => {
	const router = useRouter()
	const { path_18n } = useNode()
	const locale = router.locale
	const [open, setOpen] = useState(false)
	const ref = useRef(null)

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false)
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const others = languages.filter((lang) => lang.code !== locale)

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setOpen((o) => !o)}
				style={{ borderColor: "#08286A", color: "#08286A" }}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = "#08286A"
					e.currentTarget.style.color = "#fff"
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = "transparent"
					e.currentTarget.style.color = "#08286A"
				}}
				className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold uppercase transition"
			>
				{locale}
				<Icon
					id="chevron-down"
					className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className="absolute right-0 top-full z-50 mt-1 w-28 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
					{others.map((lang) => (
						<Link
							key={lang.code}
							href={path_18n?.[lang.code] || `/${lang.code}`}
							onClick={() => setOpen(false)}
							style={{ color: "#9B9B9B" }}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#017CFE"
								e.currentTarget.style.color = "#fff"
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "transparent"
								e.currentTarget.style.color = "#9B9B9B"
							}}
							className="block px-4 py-2 text-xs font-bold uppercase transition"
						>
							{lang.label}
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
