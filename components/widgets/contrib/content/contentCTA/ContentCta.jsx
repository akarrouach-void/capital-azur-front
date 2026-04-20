import { Button, Heading } from "@/ui"

export const ContentCta = ({ title, description, link }) => {
	return (
		<div className="mx-auto w-4/5 text-center">
			{title && (
				<Heading level={2} variant={2} className="mb-5">
					{title}
				</Heading>
			)}
			{description && description}
			{link?.href && link?.title && (
				<div className="text-center">
					<Button
						{...link}
						variant="gradient"
						className="mx-auto w-fit whitespace-nowrap"
					>
						{link.title}
					</Button>
				</div>
			)}
		</div>
	)
}
