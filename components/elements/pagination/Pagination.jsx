import Head from "next/head"

import { useI18n } from "@vactorynext/core/hooks"
import { Icon } from "@/ui"
import { GeneratePaginationButtons, getUrl, vclsx } from "@vactorynext/core/utils"

import { pagination } from "./theme"

const SequentialHeadinks = (props) => {
	const { baseUrl = "#.", total, pageSize } = props
	const count = Math.ceil(total / pageSize)
	const current = parseInt(props.current)
	if (baseUrl === "#.") {
		return null
	}

	return (
		<Head>
			{current > 1 && <link rel="prev" href={getUrl(baseUrl, current - 1)} />}
			{current !== count && <link rel="next" href={getUrl(baseUrl, current + 1)} />}
		</Head>
	)
}

export const Pagination = (props) => {
	const {
		contentRef,
		total = 30,
		pageSize = 6,
		pagerNumber = 5,
		onChange,
		variant = "default",
		previousArrow,
		nextArrow,
		baseUrl = "#.",
		isLoading,
		id = "",
	} = props
	const count = Math.ceil(total / pageSize)
	const { t } = useI18n()
	const current = parseInt(props.current)

	return (
		<>
			<SequentialHeadinks {...props} />
			<nav className={pagination[variant].wrapper} data-testid={`${id}-container`}>
				<a
					href={current - 1 < 1 ? "#." : getUrl(baseUrl, current - 1)}
					onClick={(e) => {
						e.preventDefault()
						if (current - 1 < 1) {
							return
						}
						isLoading &&
							contentRef?.current?.scrollIntoView({
								behavior: "smooth",
								block: "nearest",
								inline: "nearest",
							})

						onChange(current - 1)
					}}
					className={vclsx(
						pagination[variant].arrow.base,
						current - 1 < 1 && pagination[variant].arrow.disabled
					)}
					title={t("Nx:Previous")}
					id={`${id}-previous`}
					data-testid={`${id}-previous`}
					aria-label={`${t("Nx:Go to page")} ${current - 1}`}
				>
					{previousArrow || (
						<>
							<Icon
								id={"chevron-left"}
								className={vclsx(pagination[variant].arrow.icon)}
							/>
							<span className="sr-only">{current - 1 < 1 ? 1 : current - 1}</span>
						</>
					)}
				</a>

				<div
					className={vclsx(pagination[variant].pager.wrapper)}
					id={`${id}-pager`}
					data-testid={`${id}-pager`}
				>
					<GeneratePaginationButtons
						count={count}
						current={current}
						pagerNumber={pagerNumber}
						id={id}
						contentRef={contentRef}
						style={pagination[variant]}
						onChange={onChange}
						baseUrl={baseUrl}
						t={t}
					/>
				</div>
				<a
					href={current + 1 > count ? "#." : getUrl(baseUrl, current + 1)}
					onClick={(e) => {
						e.preventDefault()
						if (current + 1 > count) {
							return
						}
						contentRef?.current?.scrollIntoView({
							behavior: "smooth",
							block: "start",
						})
						onChange(current + 1)
					}}
					className={vclsx(
						pagination[variant].arrow.base,
						current + 1 > count && pagination[variant].arrow.disabled
					)}
					title={t("Nx:Next")}
					id={`${id}-next`}
					data-testid={`${id}-next`}
					aria-label={`${t("Nx:Go to page")} ${current + 1}`}
				>
					{nextArrow || (
						<>
							<span className="sr-only">{current + 1 > count ? count : current + 1}</span>
							<Icon
								id={"chevron-right"}
								className={vclsx(pagination[variant].arrow.icon)}
							/>
						</>
					)}
				</a>
			</nav>
		</>
	)
}
