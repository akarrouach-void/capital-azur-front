import { vclsx } from "@vactorynext/core/utils"

import { Icon } from "../icon/Icon"
import { Link } from "../link/Link"
import { Text } from "../text/Text"
import { breadcrumb } from "./theme"
import { Animate } from "@/ui"
import Script from "next/script"

export const Breadcrumb = ({
	homeUrl,
	className = "",
	variant = "default",
	pages = [],
}) => {
	// Get current domain
	const currentDomain = typeof window !== "undefined" ? window.location.origin : ""

	// Generate BreadcrumbList schema
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			...(homeUrl
				? [
						{
							"@type": "ListItem",
							position: 1,
							name: "Accueil",
							item: homeUrl,
						},
					]
				: []),
			...pages.map((page, index) => ({
				"@type": "ListItem",
				position: index + (homeUrl ? 2 : 1),
				name: page.name,
				item: `${currentDomain}${page.href || ""}` || "#.",
			})),
		],
	}

	return (
		<>
			<div className={vclsx(breadcrumb[variant].wrapper, className)}>
				<Animate animationType="fade" cascade={true} duration={500}>
					<ol className={breadcrumb[variant].list}>
						{homeUrl && (
							<li className={breadcrumb[variant].listElement}>
								<Link href={homeUrl} className={breadcrumb[variant].link}>
									<Icon
										id={breadcrumb[variant].homeIcon.id}
										className={breadcrumb[variant].homeIcon.className}
										width={breadcrumb[variant].homeIcon.width}
										height={breadcrumb[variant].homeIcon.height}
									/>
								</Link>
							</li>
						)}
						{pages.map((page, index) => {
							return (
								<li key={page.id} className={breadcrumb[variant].listElement}>
									{index == 0 && !homeUrl ? null : (
										<Icon
											className={breadcrumb[variant].separateIcon.className}
											id={breadcrumb[variant].separateIcon.id}
											width={breadcrumb[variant].separateIcon.width}
											height={breadcrumb[variant].separateIcon.height}
										/>
									)}

									{page?.href ? (
										<Link
											href={page.href || "#."}
											className={
												page.current
													? breadcrumb[variant].linkActive
													: breadcrumb[variant].link
											}
											aria-current={page.current ? "page" : undefined}
										>
											{page.name}
										</Link>
									) : (
										<Text
											as="span"
											className={breadcrumb[variant].nolink}
											aria-current={page.current ? "page" : undefined}
										>
											{page.name}
										</Text>
									)}
								</li>
							)
						})}
					</ol>
				</Animate>
			</div>

			{/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				strategy="beforeInteractive"
			>
				{JSON.stringify(breadcrumbSchema)}
			</Script>
		</>
	)
}
