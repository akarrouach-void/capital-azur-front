import { vclsx } from "@vactorynext/core/utils"
import { Icon } from "../icon/Icon"
import { switcher } from "./theme"
import { useI18n } from "@vactorynext/core/hooks"

export const LayoutSwitcher = ({ variant = "default", listingLayout, switchLayout }) => {
	const { t } = useI18n()

	return (
		<div className={switcher[variant].container}>
			<button
				className={vclsx(
					switcher[variant].button.base,
					listingLayout === "grid"
						? switcher[variant].button.active
						: switcher[variant].button.disabled
				)}
				onClick={() => switchLayout("grid")}
				aria-label={t("Nx:switch to grid")}
			>
				<Icon id="grid" className={switcher[variant].icon} />
			</button>
			<button
				className={vclsx(
					switcher[variant].button.base,
					listingLayout === "list"
						? switcher[variant].button.active
						: switcher[variant].button.disabled
				)}
				onClick={() => switchLayout("list")}
				aria-label={t("Nx:switch to list")}
			>
				<Icon id="burger-menu" className={switcher[variant].icon} />
			</button>
		</div>
	)
}
