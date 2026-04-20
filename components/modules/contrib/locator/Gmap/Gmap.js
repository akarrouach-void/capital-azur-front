import React, { useEffect, useState, useRef } from "react"
import {
	GoogleMap,
	useJsApiLoader,
	Marker,
	InfoWindow,
	MarkerClusterer,
} from "@react-google-maps/api"
import isClient from "is-client"
import { deserialise } from "kitsu-core"
import { useRouter } from "next/router"
import { Icon, Link } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"
import GMapSearchCategory from "./Gmap-category-filter"
import GMapSearch from "./Gmap-search"
import ClusterIcon from "./images/cluster.png"
import { useNode } from "@vactorynext/core/hooks"
import { set } from "react-hook-form"

const Gmap = ({ categories, mapApikey, marker }) => {
	const [items, setItems] = useState([])
	const node = useNode()
	const [allItems, setAllItems] = useState([])
	const [center, setCenter] = useState({ lat: 30.420431, lng: -9.560905 })
	const [zoom, setZoom] = useState(6)
	const [mapRef, setMapRef] = useState(null)
	const [selectedId, setSelectedId] = useState(null)
	const childRef = useRef(null)
	const locatorRef = useRef(null)
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale

	const containerStyle = {
		width: "100%",
		height: "800px",
		margin: "0 auto",
	}

	const fetchData = async () => {
		const controller = new AbortController()
		try {
			let response = await drupal.fetch(
				`${locale}/api/locator_entity/vactory_locator?fields[locator_entity--vactory_locator]=name,field_locator_info,field_locator_category,field_locator_description,field_locator_additional_adress,field_locator_phone`,
				{
					withAuth: true,
					noProxy: false,
					signal: controller.signal,
				}
			)
			let jsonData = await response.json()
			let data = deserialise(jsonData).data
			let next = jsonData?.links?.next?.href
			if (typeof next !== "undefined") {
				while (next) {
					try {
						next = next.replace(`${node._NEXT_PUBLIC_ENV.NEXT_BASE_URL}/`, "")
						next = next.replace(`${node._NEXT_PUBLIC_ENV.DRUPAL_BASE_URL}/`, "")
						let response = await drupal.fetch(next, {
							withAuth: true,
							noProxy: false,
							signal: controller.signal,
						})
						jsonData = await response.json()
						next = jsonData?.links?.next?.href
						let nextdata = deserialise(jsonData).data
						data = [...data, ...nextdata]
						setItems(data)
					} catch (err) {
						console.error("[LOCATOR ENTITY ERROR]", err)
					}
				}
			} else {
				setItems(data)
			}

			setAllItems(data)
			setCenter({
				lat: parseFloat(data[0].field_locator_info.lat),
				lng: parseFloat(data[0].field_locator_info.lon),
			})
			setZoom(parseFloat(data[0].field_locator_info.zoom))
		} catch (err) {
			console.error("[LOCATOR ENTITY ERROR]", err)
		}

		return () => controller.abort()
	}

	useEffect(() => {
		fetchData()
	}, [])

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		region: "MA",
		googleMapsApiKey: mapApikey,
	})

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

	const filterByCategory = (id) => {
		childRef.current.clearInputSearch()
		setSelectedId(null)
		mapRef.setZoom(3)
		mapRef.setCenter(new window.google.maps.LatLng(30.420431, -9.560905))
		if (id === "all") {
			setItems(allItems)
		} else {
			const filresItems = allItems.filter(
				(item) => item.relationships?.field_locator_category?.data?.id === id
			)
			setItems(filresItems)
		}

		// Scroll down to map on Category click
		locatorRef.current.scrollIntoView({ behavior: "smooth" })
	}

	const loadHandler = (map) => {
		setMapRef(map)
	}

	const getCurrentPosition = () => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
				setZoom(16)
			},
			(err) => {
				console.warn(`ERROR(${err.code}): ${err.message}`)
			}
		)
	}

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

	if (!isClient()) {
		return null
	}

	return isLoaded ? (
		<>
			<div className="relative flex flex-col-reverse md:pt-0">
				<GMapSearch ref={childRef} markerHandler={markerHandler} items={items} />

				<div ref={locatorRef}>
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={center}
						zoom={zoom}
						onLoad={loadHandler}
						styles={mapCustomStyle}
					>
						<MarkerClusterer options={markerClusterOptions}>
							{(clusterer) =>
								items.map((item) => (
									<>
										{items.length > 0 &&
											item.field_locator_info &&
											item.field_locator_info.lat &&
											item.field_locator_info.lon && (
												<Marker
													key={item.id}
													clusterer={clusterer}
													position={{
														lat: parseFloat(item.field_locator_info?.lat),
														lng: parseFloat(item.field_locator_info?.lon),
													}}
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
																	lat: parseFloat(item.field_locator_info?.lat),
																	lng: parseFloat(item.field_locator_info?.lon),
																}}
																onCloseClick={() => setSelectedId(null)}
															>
																<div className="max-w-[300px] p-1 md:max-w-[500px]">
																	<div className="mb-2 flex items-center justify-between">
																		<div className="mb-2 inline-flex w-auto items-center justify-center gap-1 rounded-xl border border-primary-400 bg-primary-400 px-2 py-1 text-white">
																			{/* <b className="hidden shrink-0">{t("Nx:Adresse :")}</b>{" "} */}
																			<Icon id="gps" className="h-4 w-4" />
																			<span>
																				{item.field_locator_additional_adress?.value}
																			</span>
																		</div>
																		<div className="mb-2 inline-flex w-auto items-center justify-center gap-1 rounded-xl border border-primary px-2 py-1">
																			<Icon
																				id="locator"
																				className="h-4 w-4 text-primary"
																			/>
																			<span className="font-bold">{item.name}</span>
																			{/* <b className="hidden shrink-0">{t("Name :")}</b> */}
																		</div>
																	</div>
																	<div className="mb-2 flex">
																		<b className="hidden shrink-0">
																			{t("Description :")}
																		</b>{" "}
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
											)}
									</>
								))
							}
						</MarkerClusterer>
					</GoogleMap>
				</div>

				<div
					className="absolute left-2 top-[282px] flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-sm border border-solid border-white text-white md:left-auto md:right-[60px] md:top-[10px] md:h-[40px] md:w-[40px]"
					onClick={() => getCurrentPosition()}
					onKeyDown={(e) => {
						e.key === "Enter" && getCurrentPosition()
					}}
					role="button"
					tabIndex={0}
				>
					<Icon id="gps" className="h-6 w-6" />
				</div>
				<GMapSearchCategory filterByCategory={filterByCategory} categories={categories} />
			</div>
		</>
	) : (
		<></>
	)
}

export default Gmap
