import IVehicle from "shared/interfaces/IVehicle";
import PageTitle from "components/page-title";
import ConfirmButton from "components/confirm-button";

import { refFromURL, set, update, query, get, getDatabase, ref } from "firebase/database";
import { useParams, useNavigate, UNSAFE_useScrollRestoration } from "react-router-dom";
import { useState, useEffect } from "react";

import "./styles.scss";
import App from "shared/firebase";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "components/dialog";
import IRent from "shared/interfaces/IRent";
import IUser from "shared/interfaces/IUser";
import RentStatus from "shared/enums/RentStatus";
import { toast, useToast } from "components/toast/use-toast";
import IOrdenation from "shared/interfaces/IOrdenation";
import TextBox from "components/textbox";
import Dropdown from "components/dropdown";
import { VehicleCard, VehicleCardIcon } from "components/v2/card";
import { DialogClose } from "@radix-ui/react-dialog";
import calendarIcon from "assets/calendar-icon.png";
import clockIcon from "assets/clock-icon.png";
import infoIcon from "assets/info-icon.png";

const PendentAnnouncesPage = () => {
	const orderOptions: IOrdenation<IRent>[] = [
		{
			showName: "Título",
			value: (vehicle1: IRent, vehicle2: IRent) => { return vehicle1?.vehicleName?.toLowerCase()?.localeCompare(vehicle2?.vehicleName?.toLowerCase()); }
		}
	];

	useEffect(() => {
		if (!localStorage.getItem("user"))
			navigate("/login", { replace: true });
	}, []);

	if (!localStorage.getItem("user"))
		return <></>;

	const navigate = useNavigate();
	const loggedUser: IUser = JSON.parse(localStorage.getItem("user")!);
	const [apiRents, setApiRents] = useState<IRent[]>([]);
	const [rents, setRents] = useState<IRent[]>([]);
	const [allFilters, setAllFilters] = useState<string[]>([]);
	const [ordenation, setOrdenation] = useState<IOrdenation<IRent> | undefined>();

	const db = getDatabase(App);
	const vehiclesReference = ref(db, "/rent");

	useEffect(() => {
		if (!apiRents || apiRents.length == 0)
			get(query(vehiclesReference)).then(x => {
				const dbVehicles: IRent[] = Object.values(x.val());
				const userDbVehicles = dbVehicles.filter(x => x.rentUserId == loggedUser.id);

				setApiRents(userDbVehicles.sort((a, b) => a.status - b.status));
				setRents(userDbVehicles.sort((a, b) => a.status - b.status));
			});
	}, []);

	useEffect(() => {
		ApplyFiltersAndOrdenations();
	}, [allFilters, ordenation]);

	const addFilter = (filter: string) => {
		const filters = filter.split(" ");

		setAllFilters(filters);
	};

	const ApplyFiltersAndOrdenations = () => {
		let filteredApiVehicles = apiRents.filter(vehicle => allFilters.filter(x => vehicle.smartSearch.toLowerCase().includes(x.toLowerCase())).length == allFilters.length);

		if (ordenation != undefined)
			filteredApiVehicles = filteredApiVehicles.sort(ordenation.value);

		setRents(filteredApiVehicles);
	};

	const addOrdenation = (value: string) => {
		const orderOption = orderOptions.filter(x => x.showName == value)[0];

		setOrdenation(orderOption);
	};

	return (
		<div className="pendent-announce-page">
			<PageTitle pageName="Meus" />
			<div className="filter">
				<div className="filter-fields">
					<TextBox placeholder="Pesquisar" onChange={addFilter} />
					<Dropdown onChange={addOrdenation} options={orderOptions.map(x => x.showName)} placeholder="Ordenar Por" />
				</div>
			</div>
			<div className="pendent-announce-container">
				<div className="pendent-announce-container-cards">
					{rents.map(rent => (
						<VehicleCard key={rent.id} notClickable isDeactivate={(rent.status != RentStatus.APPROVED)} title={rent.vehicleName} image={rent.vehicleImage}>
							<VehicleCardIcon icon={clockIcon} roundedIcon text={`De ${rent?.vehicleRentInitialDate ?? "-"} até ${rent?.vehicleRentFinalDate ?? "-"}`} />
							<VehicleCardIcon icon={calendarIcon} text={`Solicitado dia ${rent?.createdAt ?? "-"}`} />
							<VehicleCardIcon icon={infoIcon} text={`${rent.status == 1 ? "Locação APROVADA" : rent.status == 2 ? "Locação NEGADA" : "Locação PENDENTE"}`} />
							<VehicleCardIcon icon={rent.vehicleOwnerImage} roundedIcon text={`${rent.vehicleOwnerName}`} />
						</VehicleCard>
					))}
				</div>
			</div>
		</div>
	);
};

export default PendentAnnouncesPage;