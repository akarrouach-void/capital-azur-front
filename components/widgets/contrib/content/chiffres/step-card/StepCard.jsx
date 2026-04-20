import { Heading, Link, Text } from "@/ui"

export const StepCard = ({ step, title, description, cta }) => {
	return (
		<div className="flex h-full flex-col items-start rounded-lg border border-gray-100 bg-white px-5 py-5 shadow">
			{step && <Text className="mb-5 block text-7xl font-bold text-gray">{step}</Text>}
			{title && (
				<Heading level="3" className="!mb-4 !leading-none">
					{title}
				</Heading>
			)}
			{description && <Text className="mb-5">{description}</Text>}
			{cta?.href && cta?.title && (
				<Link {...cta} variant="permalink" className="mt-auto">
					{cta.title}
				</Link>
			)}
		</div>
	)
}
