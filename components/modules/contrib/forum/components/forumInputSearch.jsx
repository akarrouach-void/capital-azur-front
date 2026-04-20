import { useForm } from "react-hook-form"
import { Icon, Input, Button } from "@/ui"
import { useRouter } from "next/router"
import { useI18n } from "@vactorynext/core/hooks"

export const ForumInputSearch = ({ onSubmit }) => {
	const { t } = useI18n()
	const router = useRouter()
	const { q } = router.query

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			keyword: q || "",
		},
	})

	return (
		<form className="mt-8 flex max-w-xl" onSubmit={handleSubmit(onSubmit)}>
			<Input
				variant="search"
				{...register("keyword", { required: t("Nx:Keyword is required") })}
				prefix={<Icon id="search" className="h-4 w-4 text-gray active:text-gray"></Icon>}
				hasError={errors?.keyword}
				errorMessage={errors?.keyword?.message}
				placeholder={t("Nx:What are you searching for ?")}
			/>

			<Button type="submit" variant="primary" className="ml-2">
				{t("Nx:Submit")}
			</Button>
		</form>
	)
}
