import { Link, Text } from "@/ui"

const ConfirmationStep = ({ title, description, link }) => {
	return (
		<div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-6 text-center shadow-md">
			<Text className="text-2xl font-semibold text-gray-800">{title}</Text>
			<Text className="text-sm text-gray-500">{description}</Text>
			<Link variant="permalink" href={link.url} className="text-blue-500 hover:underline">
				{link.title}
			</Link>
		</div>
	)
}

export default ConfirmationStep
