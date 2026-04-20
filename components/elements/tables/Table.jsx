import { useRef, useState, useLayoutEffect } from "react"
import { vclsx } from "@vactorynext/core/utils"
import { Icon, Text } from "@/ui"
import { table } from "./theme"

const TableHeadItem = ({
	item,
	variant,
	onColClick,
	sortKey,
	directionSort = "DESC",
}) => {
	return (
		<th
			className={table[variant].th + " " + (item?.className || "")}
			onClick={() =>
				item.sortKey && item.sortKey !== "" && typeof onColClick === "function"
					? onColClick(item.sortKey)
					: null
			}
		>
			<div className="flex items-center justify-between">
				<Text variant="body2" className="mr-4">
					{item.heading}
				</Text>

				{item.sortKey && item.sortKey !== "" && sortKey !== item.sortKey && (
					<Icon id="switch-vertical" width="18" height="18" />
				)}
				{sortKey === item.sortKey && directionSort == "DESC" && (
					<Icon id="arrow-up-solid" width="18" height="18" />
				)}
				{sortKey === item.sortKey && directionSort == "ASC" && (
					<Icon id="arrow-down-solid" width="18" height="18" />
				)}
			</div>
		</th>
	)
}
const TableRow = ({ item, column, variant }) => {
	return (
		<tr className={table[variant].tbodyRow}>
			{column.map((columnItem) => {
				return (
					<td
						className={table[variant].td + " " + (columnItem?.className || "")}
						key={columnItem?.value}
					>
						<Text variant="body2">{item[`${columnItem.value}`]}</Text>
					</td>
				)
			})}
		</tr>
	)
}
const TableFooter = ({ variant, columnFooter }) => {
	return (
		<tr className={vclsx(table[variant].td)}>
			{columnFooter.map((item) => (
				<td
					colSpan={item.colSpan}
					className={vclsx(table[variant].td, item?.className)}
					key={item?.id || item?.value}
				>
					<Text variant="large" className="font-semibold text-white">
						{item.value}
					</Text>
				</td>
			))}
		</tr>
	)
}

export const Table = ({
	data,
	column,
	columnFooter,
	variant = "default",
	directionSort,
	sortKey,
	onColClick,
}) => {
	const refTablewrapper = useRef()
	const refTable = useRef()

	const [widthWrapper, setWidthWrapper] = useState(0)
	const [width, setWidth] = useState(0)

	useLayoutEffect(() => {
		setWidthWrapper(refTablewrapper.current.offsetWidth)
		setWidth(refTable.current.offsetWidth)
	}, [])
	return (
		<div className="relative">
			<div
				className={vclsx(
					table[variant].wrapper,
					width > widthWrapper && table[variant].scrollIndice
				)}
				ref={refTablewrapper}
			>
				<table className={table[variant].table} ref={refTable}>
					<thead className={table[variant].thead}>
						<tr>
							{column.map((item) => (
								<TableHeadItem
									onColClick={onColClick}
									sortKey={sortKey}
									directionSort={directionSort}
									item={item}
									variant={variant}
									key={item?.value}
								/>
							))}
						</tr>
					</thead>
					<tbody className={table[variant].tbody}>
						{data.map((item) => (
							<TableRow item={item} column={column} variant={variant} key={item?.id} />
						))}
					</tbody>
					{columnFooter && (
						<tfoot className={vclsx(table[variant].tfoot)}>
							<TableFooter variant={variant} columnFooter={columnFooter} />
						</tfoot>
					)}
				</table>
			</div>
		</div>
	)
}
