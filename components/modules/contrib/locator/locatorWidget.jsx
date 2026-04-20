import dynamic from "next/dynamic"

const DynamicGmap = dynamic(() => import("./Gmap/Gmap"), {
	loading: () => <p>Loading...</p>,
	ssr: false,
})

export const config = {
	id: "vactory_locator:default",
	lazy: true,
}

const Locator = ({ data }) => {
	const { map_api_key, marker } = data.config

	return (
		<DynamicGmap categories={data?.categories} mapApikey={map_api_key} marker={marker} />
	)
}

export default Locator
