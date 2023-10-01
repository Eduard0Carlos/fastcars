import VehicleCard from "components/card";
import IVehicle from "shared/interfaces/IVehicle";
import TextBox from "components/textbox";
import Dropdown from "components/dropdown";
import IOrdenation from "shared/interfaces/IOrdenation";
import PageTitle from "components/page-title";
import App from "shared/firebase";
import { Loader } from "@googlemaps/js-api-loader";

import { refFromURL, set, update, query, get, getDatabase, ref } from "firebase/database";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./styles.scss";
import axios from "axios";

const CatalogPage = () => {

	const orderOptions: IOrdenation<IVehicle>[] = [
		{
			showName: "Título",
			value: (vehicle1: IVehicle, vehicle2: IVehicle) => { return vehicle1.name.toLowerCase().localeCompare(vehicle2.name.toLowerCase()); }
		},
		{
			showName: "Preço",
			value: (vehicle1: IVehicle, vehicle2: IVehicle) => { return vehicle1.price - vehicle2.price; }
		},
		{
			showName: "Localização",
			value: (vehicle1: IVehicle, vehicle2: IVehicle) => { return vehicle1.location?.localeCompare(vehicle2?.location?.toLowerCase()); }
		},
		{
			showName: "Avaliação",
			value: (vehicle1: IVehicle, vehicle2: IVehicle) => { return vehicle2.stars - vehicle1.stars; }
		}
	];

	const db = getDatabase(App);
	const vehiclesReference = ref(db, "/vehicles");
	const navigate = useNavigate();
	const [apiVehicles, setApiVehicles] = useState<IVehicle[]>([]);
	const [vehicles, setVehicles] = useState<IVehicle[]>([]);
	const [allFilters, setAllFilters] = useState<string[]>([]);
	const [ordenation, setOrdenation] = useState<IOrdenation<IVehicle> | undefined>();
	const [canSearchForLocation, setCanSearchForLocation] = useState<boolean>();
	const [notificationAccepted, setnotificationAccepted] = useState<boolean>();
	const [blockSearchForLocation, setblockSearchForLocation] = useState<boolean>();

	const [userLocationLatitude, setUserLocationLatitute] = useState(0);
	const [userLocationLongitude, setuserLocationLongitude] = useState(0);

	useEffect(() => {
		const setLocation = ({ coords }: any) => {
			setUserLocationLatitute(coords.latitude);
			setuserLocationLongitude(coords.longitude);

			if (!coords.latitude || !coords.longitude)
				setblockSearchForLocation(true);

			setnotificationAccepted(true);
		};

		const setError = () => {
			setblockSearchForLocation(true);
		};

		window.navigator.geolocation.getCurrentPosition(setLocation, setError);

		const getVehicles = async () => {
			const dbVehicles: IVehicle[] = Object.values((await get(query(vehiclesReference))).val());

			setApiVehicles(dbVehicles);
			setVehicles(dbVehicles);
		};

		getVehicles();
	}, []);

	useEffect(() => {
		if (apiVehicles.length > 0)
			setCanSearchForLocation(true);

		const localStorageVehicleLocalizations = localStorage.getItem("vehicle-localizations");
		const vehicleLocalizations: any[] = localStorageVehicleLocalizations ? JSON.parse(localStorageVehicleLocalizations) : [];

		vehicleLocalizations.forEach(storage => {
			const apiVehicle = apiVehicles.find(x => x.id == storage.vehicleId);

			if (!apiVehicle)
				return;

			apiVehicle.smartSearch += ` ${storage.localization ?? "-"}`;
			apiVehicle.location = storage.localization;
		});
	}, [apiVehicles]);

	useEffect(() => {
		if (notificationAccepted && canSearchForLocation && !blockSearchForLocation) {
			const searchForNewLocalizations = async () => {
				const localStorageVehicleLocalizations = localStorage.getItem("vehicle-localizations");
				const vehicleLocalizations: any[] = localStorageVehicleLocalizations ? JSON.parse(localStorageVehicleLocalizations) : [];
				const searchVehicles = apiVehicles.filter(x => !vehicleLocalizations.find(z => z.vehicleId == x.id));

				console.log(searchVehicles);

				for (let index = 0; index < searchVehicles.length; index++) {
					const vehicle = searchVehicles[index];

					try {
						let localization = vehicleLocalizations?.find(x => x.vehicleId == vehicle.id)?.localization;

						if (!localization) {
							const { DirectionsService } = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;

							const service = new DirectionsService();
							const request = {
								origin: `${userLocationLatitude}, ${userLocationLongitude}`,
								destination: `${vehicle.cep} - ${vehicle.city}, ${vehicle.uf}, ${vehicle.country}`,
								travelMode: google.maps.TravelMode.DRIVING,
								language: "pt-br"
							};
							const apiLocationData = await service.route(request);

							const kms = apiLocationData.routes[0].legs[0].distance?.text;

							localization = kms ?? "-";
							vehicleLocalizations.push({ vehicleId: vehicle.id, localization: kms });
						}
						vehicle.location = localization ?? "-";
						vehicle.smartSearch += ` ${localization ?? "-"}`;
					} catch (error) {
						return;
					}
				}

				localStorage.setItem("vehicle-localizations", JSON.stringify(vehicleLocalizations));
				const allVehicles = [...searchVehicles, ...apiVehicles.filter(x => !searchVehicles.find(z => z.id === x.id))];
				setVehicles(allVehicles);
				setApiVehicles(allVehicles);
			};

			searchForNewLocalizations();
		}
	}, [canSearchForLocation, notificationAccepted]);

	if (!apiVehicles)
		return <></>;

	useEffect(() => {
		ApplyFiltersAndOrdenations();
	}, [allFilters, ordenation]);

	const addFilter = (filter: string) => {
		const filters = filter.split(" ");

		setAllFilters(filters);
	};

	const ApplyFiltersAndOrdenations = () => {
		let filteredApiVehicles = apiVehicles.filter(vehicle => allFilters.filter(x => vehicle.smartSearch.toLowerCase().includes(x.toLowerCase())).length == allFilters.length);

		if (ordenation != undefined)
			filteredApiVehicles = filteredApiVehicles.sort(ordenation.value);

		setVehicles(filteredApiVehicles);
	};

	const addOrdenation = (value: string) => {
		const orderOption = orderOptions.filter(x => x.showName == value)[0];

		setOrdenation(orderOption);
	};

	const onCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, vehicle: IVehicle) => {
		navigate(`vehicle/${vehicle.id}`, { state: { vehicle } });
	};

	return (
		<div className="catalog-page">
			<PageTitle pageName="VEICULOS" />
			<div className="filter">
				<div className="filter-fields">
					<TextBox placeholder="Pesquisar" onChange={addFilter} />
					<Dropdown onChange={addOrdenation} options={orderOptions.map(x => x.showName)} placeholder="Ordenar Por" />
				</div>
			</div>
			<div className="catalog-container">
				<div className="catalog-container-cards">
					{vehicles.map(vehicle => (<VehicleCard key={vehicle.id} vehicle={vehicle} onClick={onCardClick} />))}
				</div>
			</div>
		</div>
	);
};

export default CatalogPage;