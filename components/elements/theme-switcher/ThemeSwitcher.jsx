import React, { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Icon, Text } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import Cookies from "js-cookie"
import { themeSwitcher } from "./theme"

/**
 * Helper function to determine the appropriate icon ID based on theme and system theme
 * @param {string} theme - Current theme selection
 * @param {string} systemTheme - System preference theme
 * @returns {string} Icon ID to display
 */
function getThemeIconId(theme, systemTheme) {
	if (theme === "dark") {
		return "moon"
	}

	if (theme === "light") {
		return "light"
	}

	// For system theme, use system preference
	return systemTheme === "dark" ? "moon" : "light"
}

export const ThemeChanger = ({ variant = "default" }) => {
	const { t } = useI18n()
	const [mounted, setMounted] = useState(false)
	const [openSwitcher, setOpenSwitcher] = useState(false)
	const { theme, setTheme, systemTheme } = useTheme()
	const wrapperRef = useRef(null)

	useEffect(() => {
		setMounted(true)

		const updateThemeBasedOnSystem = () => {
			// Directly use systemTheme if 'system' is selected, otherwise use the set theme
			const newTheme = theme === "system" ? systemTheme : theme

			// Setting cookie with the selected theme
			Cookies.set("projectThemeCookie", newTheme)
		}

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		mediaQuery.addEventListener("change", updateThemeBasedOnSystem) // Update theme when system preference changes
		updateThemeBasedOnSystem() // Also update on component mount

		return () => mediaQuery.removeEventListener("change", updateThemeBasedOnSystem)
	}, [theme, systemTheme])

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setOpenSwitcher(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	/* This is a specific request to purge cache from inginx to fix images caching during switching themes ( it takes 1 min for cached images to be replaced with new ones, So the solution is to purge nginx cache to fix this problem ) */
	const switchTheme = async (theme) => {
		setTheme(theme)
		/* eslint-disable no-restricted-globals */
		try {
			const response = await fetch(`/*`, {
				method: "PURGE",
			})

			if (!response.ok) {
				console.error("Error:", response.statusText)
			}
		} catch {
			console.warn("No Cache to purge, Ignore !")
		}
	}

	if (!mounted) {
		return null
	}

	return (
		<div className={themeSwitcher[variant].wrapper} ref={wrapperRef}>
			<button
				onClick={() => {
					setOpenSwitcher(!openSwitcher)
				}}
				className={themeSwitcher[variant].button}
				aria-label={t("Nx:toggle theme switcher")}
				data-testid="theme-switcher-button"
			>
				<Icon
					id={getThemeIconId(theme, systemTheme)}
					className={themeSwitcher[variant].icon}
				/>
			</button>
			{openSwitcher && (
				<div className={themeSwitcher[variant].menu}>
					<Text
						className={vclsx(
							"group relative flex cursor-pointer items-center justify-start gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 ease-out",
							theme === "light"
								? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
								: "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 dark:text-gray-200 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 dark:hover:text-blue-400"
						)}
						onClick={() => {
							switchTheme("light")
						}}
						data-testid="theme-switcher-light"
					>
						<Icon
							id="light"
							className={vclsx(
								"h-5 w-5 transition-all duration-300",
								theme === "light"
									? "text-white drop-shadow-sm"
									: "text-amber-500 group-hover:scale-110 group-hover:text-amber-600"
							)}
						/>
						{t("Nx:Light Mode")}
					</Text>
					<Text
						className={vclsx(
							"group relative flex cursor-pointer items-center justify-start gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 ease-out",
							theme === "dark"
								? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg dark:text-black"
								: "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600 dark:text-gray-200 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 dark:hover:text-purple-400"
						)}
						onClick={() => {
							switchTheme("dark")
						}}
						data-testid="theme-switcher-dark"
					>
						<Icon
							id="moon"
							className={vclsx(
								"h-5 w-5 transition-all duration-300",
								theme === "dark"
									? "text-white drop-shadow-sm dark:text-black"
									: "text-indigo-500 group-hover:scale-110 group-hover:text-indigo-600"
							)}
						/>
						{t("Nx:Dark Mode")}
					</Text>
					<Text
						className={vclsx(
							"group relative flex cursor-pointer items-center justify-start gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 ease-out",
							theme === "system"
								? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg dark:text-black"
								: "text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 dark:text-gray-200 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 dark:hover:text-emerald-400"
						)}
						onClick={() => {
							switchTheme("system")
						}}
						data-testid="theme-switcher-system"
					>
						<Icon
							id="laptop"
							className={vclsx(
								"h-5 w-5 transition-all duration-300",
								theme === "system"
									? "text-white drop-shadow-sm dark:text-black"
									: "text-emerald-500 group-hover:scale-110 group-hover:text-emerald-600"
							)}
						/>
						{t("Nx:System")}
					</Text>
				</div>
			)}
		</div>
	)
}
