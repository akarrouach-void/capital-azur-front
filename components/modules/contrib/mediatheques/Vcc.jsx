import { normalizeVCC } from "./normalizer"
import { MediathequeCard } from "./MediathequeCard"
import { Button, Heading } from "@/ui"

export const Vcc = ({ data }) => {
	const cardes = normalizeVCC(data?.nodes)
	return (
		<div>
			{data?.title && (
				<Heading level="2" className="mb-10 text-center">
					{data.title}
				</Heading>
			)}
			<div className="grid gap-5 md:grid-cols-3">
				{cardes.map((item) => {
					return <MediathequeCard key={item.id} {...item} />
				})}
			</div>
			{data?.more_link && data?.more_link_label && (
				<div className="mt-10 text-center">
					<Button href={data?.more_link}>{data?.more_link_label}</Button>
				</div>
			)}
		</div>
	)
}
