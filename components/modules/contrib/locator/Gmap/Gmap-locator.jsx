import React, { useState } from "react"
import {
	GoogleMap,
	useJsApiLoader,
	Marker,
	InfoWindow,
	MarkerClusterer,
} from "@react-google-maps/api"
import { Icon, Link } from "@/ui"
import ClusterIcon from "./images/cluster.png"
import { useI18n } from "@vactorynext/core/hooks"

const GmapStore = ({ items, mapApikey, marker }) => {
	const center = { lat: 30.420431, lng: -9.560905 }
	const zoom = 5
	const [mapRef, setMapRef] = useState(null)
	const [selectedId, setSelectedId] = useState(null)

	const { t } = useI18n()
	const containerStyle = {
		width: "100%",
		height: "800px",
		margin: "0 auto",
	}

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		region: "MA",
		googleMapsApiKey: mapApikey,
	})

	// const markers = items.map((item) => (
	// 	<Marker
	// 		key={item.id}
	// 		position={{
	// 			lat: parseFloat(item.field_locator_info.lat),
	// 			lng: parseFloat(item.field_locator_info.lon),
	// 		}}
	// 		icon={{
	// 			url: marker,
	// 			scaledSize: new window.google.maps.Size(64, 64),
	// 		}}
	// 		onClick={(event) => markerHandler(event, { item })}
	// 	>
	// 		{selectedId === item.id && (
	// 			<InfoWindow
	// 				position={{
	// 					lat: parseFloat(item.field_locator_info.lat),
	// 					lng: parseFloat(item.field_locator_info.lon),
	// 				}}
	// 				onCloseClick={() => setSelectedId(null)}
	// 			>
	// 				<div>
	// 					<h1>Name : {item.name}</h1>
	// 					<h1>Description : {item.field_locator_description}</h1>
	// 					<h1>Adresse : {item.field_locator_additional_adress?.value}</h1>
	// 					<h1>Phone : {item.field_locator_phone}</h1>
	// 				</div>
	// 			</InfoWindow>
	// 		)}
	// 	</Marker>
	// ))

	const markerHandler = (event, item) => {
		// Set selected position ID
		setSelectedId(item.item.id)

		// Center map.
		mapRef.setCenter(
			new window.google.maps.LatLng(
				item.item.field_locator_info.lat,
				item.item.field_locator_info.lon
			)
		)

		// Zoom to marker.
		if (mapRef.getZoom() < 16) {
			mapRef.setZoom(16)
		}
	}

	const loadHandler = (map) => {
		setMapRef(map)
	}

	// const getCurrentPosition = () => {
	// 	navigator.geolocation.getCurrentPosition(
	// 		(pos) => {
	// 			setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
	// 			setZoom(16)
	// 		},
	// 		(err) => {
	// 			console.warn(`ERROR(${err.code}): ${err.message}`)
	// 		}
	// 	)
	// }

	const markerClusterOptions = {
		styles: [
			{
				url: ClusterIcon.src,
				height: 64,
				width: 64,
				anchor: [64, 64],
				textColor: "#ffffff",
				textSize: 10,
			},
		],
	}
	const mapCustomStyle = [
		{
			featureType: "all",
			elementType: "labels.text",
			stylers: [
				{
					color: "#878787",
				},
			],
		},
		{
			featureType: "all",
			elementType: "labels.text.stroke",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "landscape",
			elementType: "all",
			stylers: [
				{
					color: "#f9f5ed",
				},
			],
		},
		{
			featureType: "road.highway",
			elementType: "all",
			stylers: [
				{
					color: "#f5f5f5",
				},
			],
		},
		{
			featureType: "road.highway",
			elementType: "geometry.stroke",
			stylers: [
				{
					color: "#c9c9c9",
				},
			],
		},
		{
			featureType: "water",
			elementType: "all",
			stylers: [
				{
					color: "#aee0f4",
				},
			],
		},
	]

	return isLoaded ? (
		<>
			<div className="w-full">
				{/* <div ref={locatorRef}> */}
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={center}
					zoom={zoom}
					onLoad={loadHandler}
					styles={mapCustomStyle}
				>
					<MarkerClusterer options={markerClusterOptions}>
						{(clusterer) =>
							items.map((item) => {
								// field_locator_info is a VactoryGoogleMapField: { lat, lon }
								// field_vactory_locator_geofield (geofield) is a "lat,lon" string — fallback
								let lat, lon
								if (item.field_locator_info?.lat && item.field_locator_info?.lon) {
									lat = parseFloat(item.field_locator_info.lat)
									lon = parseFloat(item.field_locator_info.lon)
								} else if (item.field_vactory_locator_geofield) {
									const parts = item.field_vactory_locator_geofield.split(",")
									lat = parseFloat(parts[0]?.trim())
									lon = parseFloat(parts[1]?.trim())
								}
								if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null

								return (
									<Marker
										key={item.id}
										clusterer={clusterer}
										position={{ lat, lng: lon }}
										icon={{
											url: marker,
											scaledSize: new window.google.maps.Size(64, 64),
										}}
										onClick={(event) => markerHandler(event, { item })}
									>
										{selectedId === item.id && (
											<>
												<InfoWindow
													position={{
														lat: parseFloat(lat.replace(/(\r\n|\n|\r)/gm, "").trim()),
														lng: parseFloat(lon.replace(/(\r\n|\n|\r)/gm, "").trim()),
													}}
													onCloseClick={() => setSelectedId(null)}
												>
													<div className="max-w-[300px] p-1 md:max-w-[500px]">
														<div className="mb-2 flex items-center justify-between">
															<div className="mb-2 inline-flex w-auto items-center justify-center gap-1 rounded-xl border border-primary-400 bg-primary-400 px-2 py-1 text-white">
																{/* <b className="hidden shrink-0">{t("Nx:Adresse :")}</b>{" "} */}
																<Icon id="gps" className="h-4 w-4" />
																<span>{item.field_locator_additional_adress?.value}</span>
															</div>
															<div className="mb-2 inline-flex w-auto items-center justify-center gap-1 rounded-xl border border-primary px-2 py-1">
																<Icon id="locator" className="h-4 w-4 text-primary" />
																<span className="font-bold">{item.name}</span>
																{/* <b className="hidden shrink-0">{t("Name :")}</b> */}
															</div>
														</div>
														<div className="mb-2 flex">
															<b className="hidden shrink-0">{t("Description :")}</b>{" "}
															{item.field_locator_description}
														</div>
														<div className="mb-2 mt-4 flex">
															<Link
																href={`tel:${item.field_locator_phone}`}
																className="inline-flex gap-2 rounded-2xl border border-primary bg-primary px-3 py-1 text-white hover:bg-transparent hover:text-primary"
															>
																<Icon id="phone" className="h-4 w-4" />
																<b className="shrink-0">{t("Nx:Tél:")}</b>{" "}
																{item.field_locator_phone}
															</Link>
														</div>
													</div>
												</InfoWindow>
											</>
										)}
									</Marker>
								)
							})
						}
					</MarkerClusterer>
				</GoogleMap>
			</div>
		</>
	) : (
		<></>
	)
}

export default GmapStore
